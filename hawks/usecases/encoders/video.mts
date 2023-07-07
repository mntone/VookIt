import { existsSync } from 'fs'

import FFmpegVideoOptions from '../../encoders/options/ffmpeg-video.js'
import { VideoData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { getFramerate } from '../../models/Framerate.mjs'
import { Size } from '../../models/Size.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getOutputFilepath } from '../../utils/fileSupport.mjs'
import { Filters, VideoFilter } from '../filters/index.mjs'
import { FFmpegProgress, ffmpeg, getAwaiter } from '../trampolines/ffmpeg.mjs'

const EPSILON = 0.000001
const BASE_LOG_PIXELS = Math.log(1280 * 720)
const BASE_FRAMERATE = 30

function compareNumber(a: number, b: number) {
	return Math.abs(a - b) < EPSILON
}

function calcWidthAs16over9(height: number) {
	return 2 * Math.round(height * 8 / 9)
}

function getExpectedSize(data: VideoData, vnt: Variant): Size {
	const expectedSize: Size = {
		width: data.width,
		height: data.height,
	}

	if (vnt.encodeOptions.maxWidth) {
		if (vnt.encodeOptions.maxHeight) {
			expectedSize.width = vnt.encodeOptions.maxWidth
			expectedSize.height = vnt.encodeOptions.maxHeight

			if (data.width / expectedSize.width < data.height / expectedSize.height) {
				expectedSize.width = 2 * Math.round(0.5 * expectedSize.height * data.width / data.height)
			} else {
				expectedSize.height = 2 * Math.round(0.5 * expectedSize.width * data.height / data.width)
			}
		} else {
			expectedSize.width = vnt.encodeOptions.maxWidth
			expectedSize.height = 2 * Math.round(0.5 * expectedSize.width * data.height / data.width)
		}
	} else if (vnt.encodeOptions.maxHeight) {
		expectedSize.height = vnt.encodeOptions.maxHeight
		expectedSize.width = 2 * Math.round(0.5 * expectedSize.height * data.width / data.height)
	} else {
		// Nothing.
	}

	return expectedSize
}

// Calc "Kashikoi" Bitrate. It means adaptive clever bitrate.
function adjustBitrate(expectedSize: Size, data: VideoData, vnt: Variant) {
	if (vnt.bitrate) {
		let basePixels
		if (vnt.encodeOptions.maxHeight) {
			basePixels = calcWidthAs16over9(expectedSize.height) * expectedSize.height
		} else if (vnt.encodeOptions.maxWidth) {
			basePixels = expectedSize.width * (2 * Math.round(expectedSize.width * 9 / 32))
		} else {
			throw Error('Unknown constraint.')
		}

		let pixelRate = expectedSize.width * expectedSize.height / basePixels - 1
		if (!compareNumber(pixelRate, 0)) {
			pixelRate *= pixelRate > 0
				? vnt.tune.decreaseBitrateMultiplier
				: vnt.tune.increaseBitrateMultiplier
		}

		const framerate = getFramerate(data.framerate)
		const expectedFramerate = vnt.encodeOptions.maxFramerate ? Math.min(framerate, vnt.encodeOptions.maxFramerate) : framerate
		const framerateMultiplier = 1 + 0.5 * (expectedFramerate / BASE_FRAMERATE - 1)
		const bitrate = vnt.bitrate * (1 + pixelRate) * framerateMultiplier
		return bitrate
	} else {
		const pixels = data.width * data.height
		let pixelMultiplier = 2 - Math.log(pixels) / BASE_LOG_PIXELS
		if (!compareNumber(pixelMultiplier, 1)) {
			pixelMultiplier = pixelMultiplier > 1
				? pixelMultiplier / vnt.tune.decreaseBitrateMultiplier
				: pixelMultiplier * vnt.tune.increaseBitrateMultiplier
		}

		const frameMultiplier = BASE_FRAMERATE + 0.5 * (getFramerate(data.framerate) - BASE_FRAMERATE)
		const bitrate = vnt.tune.bitsPerPixel * pixels * pixelMultiplier * frameMultiplier
		return bitrate
	}
}

/**
 * Encode video.
 * @param ctx - Encode Context
 * @param vnt - Variant
 * @returns   - Promise of void
 */
export async function encodeVideo(
	ctx: Readonly<EncodeContext<EncodeData, VideoData>>,
	vnt: Variant,
) {
	const output = await getOutputFilepath(ctx.job.data.id, vnt)
	if (existsSync(output)) {
		return null
	}

	const expectedSize = getExpectedSize(ctx.data, vnt)
	const bitrate = adjustBitrate(expectedSize, ctx.data, vnt)

	const filter = new VideoFilter(ctx.data)
		.resizeMethod(vnt.encodeOptions.resizeMethod)
		.size(expectedSize)
		.colorRange('tv') // DO NOT USE FULL RANGE
		.normalizeColors(ctx.data)
	const filters = new Filters('video', vnt.encodeOptions.postFilters as string[])
	filters.filters.unshift(filter)
	const options = new FFmpegVideoOptions(bitrate, {
		...vnt.encodeOptions,
		filters: filters.build(),
	})

	// @ts-expect-error Fix interop error
	const command = options.build({
		inputs: ctx.filepath,
		output,
	})
	await ctx.log('> ffmpeg ' + command.join(' '))

	const originalFramerate = getFramerate(ctx.data.framerate)
	const realFrames = vnt.encodeOptions.maxFramerate
		? Math.ceil(ctx.data.frames * Math.min(originalFramerate, vnt.encodeOptions.maxFramerate) / originalFramerate)
		: ctx.data.frames
	const ee = ffmpeg(command)
		.on('log', (log: string) => ctx.log(log))
		.on('progress', (p: FFmpegProgress) => ctx.updateProgress((p.frame ?? 0) / realFrames))
	await getAwaiter(ee)
}
