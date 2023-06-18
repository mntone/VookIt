const { existsSync, writeFileSync } = require('fs')
const path = require('path')

const env = require('../../../constants/env')
const { mkdirIfNeeded, getMediaFileDir } = require('../../../utils/FileSupport')
const configStore = require('../../configs/HawksConfigCacheStore')
const FFmpegEncode = require('../../encoders/FFmpegEncode')
const FFmpegAudioOptions = require('../../encoders/options/ffmpeg-audio')
const FFmpegImageOptions = require('../../encoders/options/ffmpeg-image')
const FFmpegVideoOptions = require('../../encoders/options/ffmpeg-video')

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
 * @param {string} id
 * @param          formatName
 * @param {string} formatId
 */
async function encodeAudio(id, formatName, formatId) {
	const config = configStore.formatBy(formatId)
	const fileOptions = await getFileOptions({
		id,
		type: config.type,
		inputExt: '.mp4',
		outputExt: config.ext,
		formatId: config.idstr,
	})

	if (!existsSync(fileOptions.output)) {
		const bitrate = config.bitrate || 128 * 1024
		const options = new FFmpegAudioOptions(formatName, bitrate, config.encoder)
		const encoder = new FFmpegEncode(options)
		encoder.execSync(fileOptions)
	}
}

/**
 * @param {string} id
 * @param          formatName
 * @param {string} formatId
 */
async function encodeImage(id, formatName, formatId) {
	const config = configStore.formatBy(formatId)
	const fileOptions = await getFileOptions({
		id,
		type: config.type,
		inputExt: '.mp4',
		outputExt: config.ext,
		outputFilename: config.filename,
		formatId: config.idstr,
	})

	if (!existsSync(fileOptions.output)) {
		const options = new FFmpegImageOptions(formatName, config.encoder)
		const encoder = new FFmpegEncode(options)
		encoder.execSync(fileOptions)
	}
}

/**
 * @param {string} id
 * @param          formatName
 * @param {string} formatId
 */
async function encodeVideo(id, formatName, formatId) {
	const config = configStore.formatBy(formatId)
	const fileOptions = await getFileOptions({
		id,
		type: config.type,
		inputExt: '.mp4',
		outputExt: config.ext,
		formatId: config.idstr,
	})

	if (!existsSync(fileOptions.output)) {
		const bitrate = config.bitrate || 1 * 1024 * 1024
		const options = new FFmpegVideoOptions(formatName, bitrate, config.encoder)
		const encoder = new FFmpegEncode(options)
		const buffer = encoder.execSync(fileOptions)
		writeFileSync(fileOptions.output.substring(0, fileOptions.output.length - config.ext.length) + '.log', buffer.stderr)
	}
}

/**
 * @param {import('bullmq').Job<any, void, string>} job
 */
async function encodeHandler(job) {
	const { id, format, formatId } = job.data
	console.log(`[${job.name}] ${format} / ${formatId} (${job.id})`)

	switch (format) {
	case 'avc1':
	case 'hvc1':
		await encodeVideo(id, format, formatId)
		break
	case 'jpeg':
	case 'webp':
	case 'avif':
		await encodeImage(id, format, formatId)
		break
	case 'mp4a':
	case 'opus':
		await encodeAudio(id, format, formatId)
		break
	default:
		break
	}
}

module.exports = encodeHandler
