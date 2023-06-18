const { FlowProducer } = require('bullmq')

const { existsMediaFile, getPreferredMediaFileName } = require('../../../utils/FileSupport')
const configStore = require('../../configs/HawksConfigCacheStore')

/**
 * @param   {object}                                   data
 * @param   {string}                                   data.id
 * @param   {object}                                   options
 * @param   {number}                                   options.priority
 * @param   {string}                                   options.name
 * @param   {string}                                   options.queueName
 * @returns {Promise<import('bullmq').FlowChildJob[]>}
 */
function createEncodingJob(data, options) {
	const [format, group] = options.name.split(':', 2)
	const config = configStore.loadFormatSync(format)

	// Disable these formats by config file.
	if (!config.enabled) {
		return []
	}

	const variantConfigs = group ? config.variantsByGroup[group] : config.variants
	const encodeSetWorkerInfo = variantConfigs
		.filter(variantConfig => {
			// Disable this format by config file.
			if (!variantConfig.enabled) {
				return false
			}

			// Disable this format because of existing encoded file.
			const filename = getPreferredMediaFileName(config.ext, variantConfig)
			const isExists = existsMediaFile(config.type, data.id, filename)
			if (isExists) {
				return false
			}

			return true
		})
		.map((variantConfig, i) => {
			/**
			 * @type {import('bullmq').FlowChildJob}
			 */
			const encodeWorkerInfo = {
				name: data.id + ':' + options.queueName + ':' + variantConfig.idstr,
				queueName: options.queueName,
				data: {
					...data,
					format,
					formatId: variantConfig.id,
				},
				opts: {
					priority: options.priority + 10 * (i + 1),
				},
			}
			return encodeWorkerInfo
		})
	return encodeSetWorkerInfo
}

/**
 * Postprocess must contain a video stream or more when audioonly is true.
 * Otherwise, the postprocess passes throught.
 * @param   {object}   postprocess
 * @param   {string}   postprocess.name
 * @param   {number[]} postprocess.includes
 * @param   {boolean}  postprocess.audioonly
 * @returns {boolean}
 */
function isAvailablePostprocess(postprocess) {
	// Return true when audioonly is true.
	if (postprocess.audioonly) {
		return true
	}

	// This postprocess contains one ore more video streams.
	const hasVideo = postprocess.includes.some(formatId => configStore.formatBy(formatId)?.type === 'video')
	return hasVideo
}

/**
 * @param   {import('bullmq').Job<any, void, string>} job
 * @param   {object}                                  data
 * @param   {string}                                  data.id
 * @param   {object}                                  options
 * @param   {string}                                  options.step
 * @param   {object}                                  options.flow
 * @param   {object[]}                                options.flow.encodes
 * @param   {number}                                  options.flow.encodes.priority
 * @param   {string}                                  options.flow.encodes.name
 * @param   {string?}                                 options.flow.encodes.queueName
 * @param   {object}                                  options.flow.postprocesses
 * @param   {string}                                  options.flow.postprocesses.name
 * @param   {number[]}                                options.flow.postprocesses.includes
 * @param   {string}                                  options.flow.postprocesses.workdir
 * @param   {boolean}                                 options.flow.postprocesses.hls
 * @param   {boolean}                                 options.flow.postprocesses.audioonly
 * @returns {Promise<import('bullmq').FlowJob>}
 */
async function createPostProcessJob(job, data, options) {
	// Check any of postprocess to contain a video stream or more when audioonly = false.
	const availablePostprocess = options.flow.postprocesses.filter(isAvailablePostprocess)
	if (availablePostprocess.length === 0) {
		return null
	}

	const workersConfig = await configStore.load('workers')
	const queueName = workersConfig.queues.postprocess.name
	const flowWorkerInfo = {
		name: data.id + ':' + queueName + ':' + options.step,
		queueName: queueName,
		data: {
			...data,
			context: availablePostprocess,
		},
		children: options.flow.encodes.flatMap(encode => createEncodingJob(data, {
			queueName: workersConfig.queues.encode.name,
			...encode,
		})),
		opts: {
			parent: {
				id: job.id,
				queue: job.queueQualifiedName,
			},
		},
	}
	return flowWorkerInfo
}

/**
 * @param {import('bullmq').Job<any, void, string>} job
 */
async function initHandler(job) {
	const data = {
		id: job.data.id,
	}

	const config = await configStore.load('workflows')

	// TODO: Detect format, but use 'sdr_hd'
	// - colorspace
	// - aspect (Landscape or portrait)
	const workflow = job.data.workflow || 'sdr_hd'
	const typedConfig = config.workflows[workflow]

	const flowProducer = new FlowProducer({ connection: job.connection })
	let step = job.data.step
	while (step !== typedConfig.flows.length) {
		const flowConfig = typedConfig.flows[step]
		const flow = await createPostProcessJob(job, data, {
			step,
			flow: flowConfig,
		})
		if (flow) {
			await flowProducer.add(flow)
		}
		await job.update({
			step: ++step,
		})
	}
}

module.exports = initHandler
