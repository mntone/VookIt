import { existsSync } from 'fs'

// @ts-expect-error
import FFmpegImageOptions from '../../encoders/options/ffmpeg-image.js'
import { ImageData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getOutputFilepath } from '../../utils/fileSupport.mjs'
import { ffmpeg, getAwaiter } from '../trampolines/ffmpeg.mjs'

/**
 * Encode image.
 * @param ctx - Encode Context
 * @param vnt - Variant
 * @returns   - Promise of void
 */
export async function encodeImage(
	ctx: Readonly<EncodeContext<EncodeData, ImageData>>,
	vnt: Variant,
) {
	const output = await getOutputFilepath(ctx.job.data.id, vnt)
	if (existsSync(output)) {
		return null
	}

	const options = new FFmpegImageOptions(vnt.friendlyCodecId, vnt.encodeOptions)
	const command = options.build({
		inputs: ctx.filepath,
		output,
	})
	await ctx.log('> ffmpeg ' + command.join(' '))

	const ee = ffmpeg(command)
		.on('log', (log: string) => ctx.log(log))
	await getAwaiter(ee)
}
