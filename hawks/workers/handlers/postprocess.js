const { existsSync } = require('fs')
const { join } = require('path')

const env = require('../../../constants/env')
const { getPreferredMediaFileName, getMediaFileDir } = require('../../../utils/FileSupport')
const { mkdirIfNeeded } = require('../../../utils/FileSupport')
const configStore = require('../../configs/HawksConfigCacheStore')
const FFmpegEncode = require('../../encoders/FFmpegEncode')
const FFmpegDashOptions = require('../../encoders/options/ffmpeg-dash')
const getAwaiter = require('../../encoders/utils/AwaitSupport')

/**
 * @param   {import('bullmq').Job<any, void, string>}                 job
 * @param   {string}                                                  dashFileDir
 * @param   {object}                                                  context
 * @param   {string}                                                  context.name
 * @param   {string}                                                  context.description
 * @param   {number[]}                                                context.includes
 * @param   {string}                                                  context.workdir
 * @param   {boolean}                                                 context.hls
 * @param   {boolean}                                                 context.audioonly
 * @returns {import('child_process').ChildProcessWithoutNullStreams?}
 */
async function createDash(job, dashFileDir, context) {
	const variants = context.includes.map(configStore.formatBy.bind(configStore))
	const mediaDir = getMediaFileDir('video' /* [TODO] */, job.data.id)
	const inputFiles = variants.map(f => join(mediaDir, getPreferredMediaFileName(f.ext, f)))

	const existsAll = inputFiles.every(filepath => existsSync(filepath))
	if (!existsAll) {
		throw Error('All media does not exists.')
	}

	const outputDir = join(dashFileDir, context.workdir)
	await mkdirIfNeeded(outputDir)
	const output = join(outputDir, env.mediaDashFilename)
	if (existsSync(output)) {
		return null
	}

	const options = new FFmpegDashOptions(4, {
		initSegmentName: env.mediaDashInitSegmentFilename,
		mediaSegmentName: env.mediaDashMediaSegmentFilename,
		hls: context.hls,
		hlsPlaylistType: FFmpegDashOptions.HlsPlaylist.VOD,
		hlsMasterName: env.mediaHlsFilename,
	})
	const creator = new FFmpegEncode(options)
	const child = creator.exec({
		inputs: inputFiles,
		output,
	}).on('log', l => job.log(l))
	return child
}

/**
 * @param   {import('bullmq').Job<any, void, string>} job
 * @returns {any}
 */
async function postprocessHandler(job) {
	const { id, context } = job.data
	if (!context) {
		return null
	}

	const dashFileDir = getMediaFileDir('image' /* [TODO] */, id)
	const result = await Promise.all(context.map(async child => getAwaiter(await createDash(job, dashFileDir, child))))
	return result
}

module.exports = postprocessHandler
