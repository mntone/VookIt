const { existsSync, writeFileSync } = require('fs')
const { join } = require('path')

const env = require('../../../constants/env')
const { getPreferredMediaFileName, getMediaFileDir } = require('../../../utils/FileSupport')
const { mkdirIfNeeded } = require('../../../utils/FileSupport')
const configStore = require('../../configs/HawksConfigCacheStore')
const FFmpegEncode = require('../../encoders/FFmpegEncode')
const FFmpegDashOptions = require('../../encoders/options/ffmpeg-dash')

/**
 * @param {string}   id
 * @param {string}   dashFileDir
 * @param {object}   context
 * @param {string}   context.name
 * @param {string}   context.description
 * @param {number[]} context.includes
 * @param {string}   context.workdir
 * @param {boolean}  context.hls
 * @param {boolean}  context.audioonly
 */
async function createDash(id, dashFileDir, context) {
	const variants = context.includes.map(configStore.formatBy.bind(configStore))
	const mediaDir = getMediaFileDir('video' /* [TODO] */, id)
	const inputFiles = variants.map(f => join(mediaDir, getPreferredMediaFileName(f.ext, f)))

	const existsAll = inputFiles.every(filepath => existsSync(filepath))
	if (!existsAll) {
		throw Error('All media does not exists.')
	}

	const outputDir = join(dashFileDir, context.workdir)
	await mkdirIfNeeded(outputDir)
	const output = join(outputDir, env.mediaDashFilename)

	if (!existsSync(output)) {
		const options = new FFmpegDashOptions(4, {
			initSegmentName: env.mediaDashInitSegmentFilename,
			mediaSegmentName: env.mediaDashMediaSegmentFilename,
			hls: context.hls,
			hlsPlaylistType: FFmpegDashOptions.HlsPlaylist.VOD,
			hlsMasterName: env.mediaHlsFilename,
		})
		const creator = new FFmpegEncode(options)
		const buffer = creator.execSync({
			inputs: inputFiles,
			output,
		})
		writeFileSync(join(outputDir, 'dash.log'), buffer.stderr)
	}
}

/**
 * @param {import('bullmq').Job<any, void, string>} job
 */
async function postprocessHandler(job) {
	const { id, context } = job.data
	console.log(`[${job.name}]`)
	if (context) {
		const dashFileDir = getMediaFileDir('image' /* [TODO] */, id)
		for (const childContext of context) {
			await createDash(id, dashFileDir, childContext)
		}
	}
}

module.exports = postprocessHandler
