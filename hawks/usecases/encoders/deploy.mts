import { existsSync } from 'fs'
import { join } from 'path'

import env from '../../../constants/env.js'
import FFmpegDashOptions from '../../encoders/options/ffmpeg-dash.js'
import { DeployContext } from '../../models/encoders/DeployContext.mjs'
import { MediaData } from '../../models/encoders/MediaData.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getCmafFilepath, getOutputDirname, getOutputFilename } from '../../utils/fileSupport.mjs'
import { ffmpeg, getAwaiter } from '../trampolines/ffmpeg.mjs'
import { CodecConfigLoader } from '../workers/CodecConfigLoader.mjs'

/**
 * Create cmaf (DASH + HLS).
 * @param ctx  - Encode Context
 * @param dctx - Deploy Context
 * @returns    - Promise of void
 */
export async function createCmaf(
	ctx: Readonly<EncodeContext<EncodeData, MediaData>>,
	dctx: DeployContext,
) {
	const id = ctx.job.data.id

	// Check if dash file exists.
	const streamName = 'st_' + dctx.videoVariants.at(-1)!.friendlyId
	const filepath = await getCmafFilepath(id, streamName)
	if (existsSync(filepath)) {
		return null
	}

	// Check if all input files exist.
	const audioFiles = dctx.audioCodecFriendlyIds
		.map(id => CodecConfigLoader.instance.codecBy(id))
		.flatMap(c => c.variants.map(v => {
			return { v, dirname: getOutputDirname(id, c.public) }
		}))
		.map(({ v, dirname }) => join(dirname, getOutputFilename(v)))
	const videoDir = getOutputDirname(id, dctx.videoVariants[0].public)
	const files = audioFiles.concat(dctx.videoVariants.map(v => join(videoDir, getOutputFilename(v))))
	const existsAll = files.every(p => existsSync(p))
	if (!existsAll) {
		throw Error('All media does not exist.')
	}

	// Merge all input files
	const options = new FFmpegDashOptions(4, {
		initSegmentName: env.mediaDashInitSegmentFilename,
		mediaSegmentName: env.mediaDashMediaSegmentFilename,
		hls: dctx.videoVariants[0].useHls,
		hlsPlaylistType: FFmpegDashOptions.HlsPlaylist.VOD,
		hlsMasterName: env.mediaHlsFilename,
	})
	const command = options.build({
		inputs: files,
		output: filepath,
	})
	await ctx.log('> ffmpeg ' + command.join(' '))

	const ee = ffmpeg(command)
		.on('log', (log: string) => ctx.log(log))
	await getAwaiter(ee)
}
