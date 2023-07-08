import { existsSync } from 'fs'

import { Required } from 'utility-types'

import FFmpegAudioOptions from '../../encoders/options/ffmpeg-audio.js'
import { AudioData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getOutputFilepath } from '../../utils/fileSupport.mjs'
import { ffmpeg, getAwaiter } from '../trampolines/ffmpeg.mjs'

const BASE_CHANNELS = 2

function adjustBitrate(data: AudioData, vnt: Required<Variant, 'bitrate'>) {
	// Compare the channels to it of stereo.
	const channelRate = data.channels / BASE_CHANNELS - 1
	const multipler = channelRate >= 0
		? vnt.tune.increaseBitrateMultiplier
		: vnt.tune.decreaseBitrateMultiplier
	const adjustedBitrate = (1 + multipler * channelRate) * vnt.bitrate
	return adjustedBitrate
}

/**
 * Encode audio.
 * @param ctx - Encode Context
 * @param vnt - Variant
 * @returns   - Promise of void
 */
export async function encodeAudio(
	ctx: Readonly<EncodeContext<EncodeData, AudioData>>,
	vnt: Variant,
) {
	const output = await getOutputFilepath(ctx.job.data.id, vnt)
	if (existsSync(output)) {
		return null
	}

	const bitrate = vnt.bitrate ? adjustBitrate(ctx.data, vnt as Required<Variant, 'bitrate'>) : 128 * 1024
	const options = new FFmpegAudioOptions(bitrate, vnt.encodeOptions)

	// @ts-expect-error Fix interop error
	const command = options.build({
		inputs: ctx.filepath,
		output,
	})
	await ctx.log('> ffmpeg ' + command.join(' '))

	const ee = ffmpeg(command)
		.on('log', (log: string) => ctx.log(log))
	await getAwaiter(ee)
}
