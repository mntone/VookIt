import { existsSync } from 'fs'

import { Job } from 'bullmq'

// @ts-expect-error
import FFmpegEncode from '../../encoders/FFmpegEncode.js'
// @ts-expect-error
import FFmpegAudioOptions from '../../encoders/options/ffmpeg-audio.js'
// @ts-expect-error
import getAwaiter from '../../encoders/utils/AwaitSupport.js'
import { AudioEncodeContext } from '../../models/encoders/Context.mjs'
import { EncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { getEncodeFileinfo } from '../../utils/fileSupport.mjs'

const BASE_CHANNELS = 2

function adjustBitrate(ctx: AudioEncodeContext, vnt: Variant) {
	// Compare the channels to it of stereo.
	const channelRate = ctx.channels / BASE_CHANNELS - 1
	const multipler = channelRate >= 0
		? vnt.tune.increaseBitrateMultiplier
		: vnt.tune.decreaseBitrateMultiplier
	const adjustedBitrate = (1 + multipler * channelRate) * vnt.bitrate
	return adjustedBitrate
}

/**
 * Encode audio.
 * @param job - BullMQ.Job
 * @param ctx - Encode Context
 * @param vnt - Variant
 * @returns   - Promise of progress
 */
export async function encodeAudio(job: Job<EncodeData>, ctx: AudioEncodeContext, vnt: Variant): Promise<unknown> {
	const fileinfo = await getEncodeFileinfo(job.data, vnt)
	if (existsSync(fileinfo.output)) {
		return null
	}

	const bitrate = adjustBitrate(ctx, vnt)
	const options = new FFmpegAudioOptions(vnt.friendlyCodecId, bitrate, vnt.encodeOptions)
	const ffmpeg = new FFmpegEncode(options)
		.exec(fileinfo)
		.on('log', (log: string) => job.log(log))
		.on('progress', (p: any) => job.updateProgress(p.frame))
	return await getAwaiter(ffmpeg)
}
