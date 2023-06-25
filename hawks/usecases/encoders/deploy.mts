import { existsSync } from 'fs'
import { join } from 'path'

import { Job } from 'bullmq'

// @ts-ignore
import env from '../../../constants/env.js'
// @ts-ignore
import FFmpegEncode from '../../encoders/FFmpegEncode.js'
// @ts-ignore
import FFmpegDashOptions from '../../encoders/options/ffmpeg-dash.js'
// @ts-ignore
import getAwaiter from '../../encoders/utils/AwaitSupport.js'
import { DeployContext } from '../../models/encoders/DeployContext.mjs'
import { EncodeData } from '../../models/encoders/EncodeData.mjs'
import { getCmafFilepath, getOutputDirname, getOutputFilename } from '../../utils/fileSupport.mjs'
import { CodecConfigLoader } from '../workers/CodecConfigLoader.mjs'

/**
 * Create cmaf (DASH + HLS).
 * @param job - BullMQ.Job
 * @param ctx - Deploy Context
 * @returns   - Promise of progress
 */
export async function createCmaf(job: Job<EncodeData>, ctx: DeployContext): Promise<unknown> {
	const id = job.data.id

	// Check if dash file exists.
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const streamName = 'st_' + ctx.videoVariants.at(-1)!.friendlyId
	const filepath = await getCmafFilepath(id, streamName)
	if (existsSync(filepath)) {
		return null
	}

	// Check if all input files exist.
	const audioFiles = ctx.audioCodecFriendlyIds
		.map(id => CodecConfigLoader.instance.codecBy(id))
		.flatMap(c => c.variants.map(v => { return { v, dirname: getOutputDirname(job.data.id, c.public) } }))
		.map(({ v, dirname }) => join(dirname, getOutputFilename(v)))
	const videoDir = getOutputDirname(id, ctx.videoVariants[0].public)
	const files = audioFiles.concat(ctx.videoVariants.map(v => join(videoDir, getOutputFilename(v))))
	const existsAll = files.every(p => existsSync(p))
	if (!existsAll) {
		throw Error('All media does not exist.')
	}

	// Merge all input files
	const options = new FFmpegDashOptions(4, {
		initSegmentName: env.mediaDashInitSegmentFilename,
		mediaSegmentName: env.mediaDashMediaSegmentFilename,
		hls: ctx.videoVariants[0].useHls,
		hlsPlaylistType: FFmpegDashOptions.HlsPlaylist.VOD,
		hlsMasterName: env.mediaHlsFilename,
	})
	const ffmpeg = new FFmpegEncode(options).exec({
		inputs: files,
		output: filepath,
	}).on('log', (log: string) => job.log(log))
	return getAwaiter(ffmpeg)
}
