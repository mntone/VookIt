const { existsSync } = require('fs')
const path = require('path')

const env = require('../../../constants/env')
const { mkdirIfNeeded, getMediaFileDir } = require('../../../utils/FileSupport')
const configStore = require('../../configs/HawksConfigCacheStore')
const FFmpegEncode = require('../../encoders/FFmpegEncode')
const FFmpegAudioOptions = require('../../encoders/options/ffmpeg-audio')
const FFmpegImageOptions = require('../../encoders/options/ffmpeg-image')
const FFmpegVideoOptions = require('../../encoders/options/ffmpeg-video')
const getAwaiter = require('../../encoders/utils/AwaitSupport')

/**
 * @param   {object}                                     config
 * @param   {string}                                     config.id
 * @param   {'audio'|'image'|'video'}                    config.type
 * @param   {string}                                     config.inputExt
 * @param   {string}                                     config.outputExt
 * @param   {string?}                                    config.outputFilename
 * @param   {string}                                     config.formatId
 * @returns {Promise<{ input: string, output: string }>}
 */
async function getFileOptions(config) {
	const idstr = config.id.toString()
	const outputDir = getMediaFileDir(config.type, idstr)
	await mkdirIfNeeded(outputDir)

	const input = env.mediaOriginalFile.replace('[id]', idstr).replace('[ext]', config.inputExt)
	const outputFileName = config.outputFilename ?? config.formatId + config.outputExt
	const output = path.join(outputDir, outputFileName)
	return {
		inputs: input,
		output,
	}
}

/**
 * @param   {import('bullmq').Job<any, void, string>}                 job
 * @param   {string}                                                  job.data.id
 * @param   {string}                                                  job.data.formatName
 * @param   {string}                                                  job.data.formatId
 * @returns {import('child_process').ChildProcessWithoutNullStreams?}
 */
async function encodeAudio(job) {
	const { id, format, formatId } = job.data
	const config = configStore.formatBy(formatId)
	const fileOptions = await getFileOptions({
		id,
		type: config.type,
		inputExt: '.mp4',
		outputExt: config.ext,
		formatId: config.idstr,
	})
	if (existsSync(fileOptions.output)) {
		return null
	}

	const bitrate = config.bitrate || 128 * 1024
	const options = new FFmpegAudioOptions(format, bitrate, config.encoder)
	const encoder = new FFmpegEncode(options)
	const child = encoder.exec(fileOptions)
		.on('log', l => job.log(l))
		.on('progress', p => job.updateProgress(p.time))
	return child
}

/**
 * @param   {import('bullmq').Job<any, void, string>}                 job
 * @param   {string}                                                  job.data.id
 * @param   {string}                                                  job.data.formatName
 * @param   {string}                                                  job.data.formatId
 * @returns {import('child_process').ChildProcessWithoutNullStreams?}
 */
async function encodeImage(job) {
	const { id, format, formatId } = job.data
	const config = configStore.formatBy(formatId)
	const fileOptions = await getFileOptions({
		id,
		type: config.type,
		inputExt: '.mp4',
		outputExt: config.ext,
		outputFilename: config.filename,
		formatId: config.idstr,
	})
	if (existsSync(fileOptions.output)) {
		return null
	}

	const options = new FFmpegImageOptions(format, config.encoder)
	const encoder = new FFmpegEncode(options)
	const child = encoder.exec(fileOptions)
		.on('log', l => job.log(l))
		.on('progress', p => job.updateProgress(p))
	return child
}

/**
 * @param   {import('bullmq').Job<any, void, string>}                 job
 * @param   {string}                                                  job.data.id
 * @param   {string}                                                  job.data.formatName
 * @param   {string}                                                  job.data.formatId
 * @returns {import('child_process').ChildProcessWithoutNullStreams?}
 */
async function encodeVideo(job) {
	const { id, format, formatId } = job.data
	const config = configStore.formatBy(formatId)
	const fileOptions = await getFileOptions({
		id,
		type: config.type,
		inputExt: '.mp4',
		outputExt: config.ext,
		formatId: config.idstr,
	})
	if (existsSync(fileOptions.output)) {
		return null
	}

	const bitrate = config.bitrate || 1 * 1024 * 1024
	const options = new FFmpegVideoOptions(format, bitrate, config.encoder)
	const encoder = new FFmpegEncode(options)
	const child = encoder.exec(fileOptions)
		.on('log', l => job.log(l))
		.on('progress', p => job.updateProgress(p.frame))
	return child
}


/**
 * @param   {import('bullmq').Job<any, void, string>} job
 * @returns {any}
 */
async function encodeHandler(job) {
	const format = job.data.format

	let ffmpeg = null
	switch (format) {
	case 'avc1':
	case 'hvc1':
		ffmpeg = await encodeVideo(job)
		break
	case 'jpeg':
	case 'webp':
	case 'avif':
		ffmpeg = await encodeImage(job)
		break
	case 'mp4a':
	case 'opus':
		ffmpeg = await encodeAudio(job)
		break
	default:
		break
	}
	if (!ffmpeg) {
		return null
	}

	return await getAwaiter(ffmpeg)
}

module.exports = encodeHandler
