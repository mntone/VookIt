import { existsSync } from 'fs'

import { Job } from 'bullmq'

// @ts-ignore
import FFmpegEncode from '../../encoders/FFmpegEncode.js'
// @ts-ignore
import FFmpegVideoOptions from '../../encoders/options/ffmpeg-video.js'
// @ts-ignore
import getAwaiter from '../../encoders/utils/AwaitSupport.js'
import { VideoEncodeContext } from '../../models/encoders/Context.mjs'
import { EncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { getEncodeFileinfo } from '../../utils/fileSupport.mjs'

const BASE_ASPECT_RATIO = 16 / 9

function adjustBitrate(ctx: VideoEncodeContext, vnt: Variant) {
	// Compare the number of pixel to it of 16:9 video.
	const pixelRate = ctx.width / ctx.height / BASE_ASPECT_RATIO - 1
	const multipler = pixelRate >= 0
		? vnt.tune.increaseBitrateMultiplier
		: vnt.tune.decreaseBitrateMultiplier
	const adjustedBitrate = (1 + multipler * pixelRate) * vnt.bitrate
	return adjustedBitrate
}

/**
 * Encode video.
 * @param job - BullMQ.Job
 * @param ctx - Encode Context
 * @param vnt - Variant
 * @returns   - Promise of progress
 */
export async function encodeVideo(job: Job<EncodeData>, ctx: VideoEncodeContext, vnt: Variant): Promise<unknown> {
	const fileinfo = await getEncodeFileinfo(job.data, vnt)
	if (existsSync(fileinfo.output)) {
		return null
	}

	const bitrate = adjustBitrate(ctx, vnt)
	const options = new FFmpegVideoOptions(vnt.friendlyCodecId, bitrate, vnt.encodeOptions)
	const ffmpeg = new FFmpegEncode(options)
		.exec(fileinfo)
		.on('log', (log: string) => job.log(log))
		.on('progress', (p: any) => job.updateProgress(p.frame))
	return await getAwaiter(ffmpeg)
}
