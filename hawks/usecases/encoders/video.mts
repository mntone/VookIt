import { existsSync } from 'fs'

// @ts-expect-error
import FFmpegVideoOptions from '../../encoders/options/ffmpeg-video.js'
import { VideoData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { getFramerate } from '../../models/Framerate.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getOutputFilepath } from '../../utils/fileSupport.mjs'
import { ffmpeg, FFmpegProgress, getAwaiter } from '../trampolines/ffmpeg.mjs'

const EPSILON = 0.000001
const BASE_LOG_PIXELS = Math.log(1280 * 720)
const BASE_FRAMERATE = 30

function compareNumber(a: number, b: number) {
	return Math.abs(a - b) < EPSILON
}

function calcWidthAs16over9(height: number) {
	return 2 * Math.round(height * 8 / 9)
}

// Calc "Kashikoi" Bitrate. It means adaptive clever bitrate.
function adjustBitrate(data: VideoData, vnt: Variant) {
	if (vnt.bitrate) {
		let expectedWidth, expectedHeight, basePixels
		if (typeof vnt.encodeOptions.maxSize === 'string' && vnt.encodeOptions.maxSize.includes('x')) {
			[expectedWidth, expectedHeight] = vnt.encodeOptions.maxSize.split('x', 2).map(l => Number(l))
			basePixels = calcWidthAs16over9(expectedHeight) * expectedHeight

			if (data.width / expectedWidth < data.height / expectedHeight) {
				expectedWidth = 2 * Math.round(0.5 * expectedHeight * data.width / data.height)
			} else {
				expectedHeight = 2 * Math.round(0.5 * expectedWidth * data.height / data.width)
			}
		} else if (typeof vnt.encodeOptions.maxHeight === 'number') {
			expectedHeight = vnt.encodeOptions.maxHeight
			basePixels = calcWidthAs16over9(expectedHeight) * expectedHeight

			expectedWidth = 2 * Math.round(0.5 * expectedHeight * data.width / data.height)
		} else if (typeof vnt.encodeOptions.maxWidth === 'number') {
			expectedWidth = vnt.encodeOptions.maxWidth
			basePixels = expectedWidth * (2 * Math.round(expectedWidth * 9 / 32))

			expectedHeight = 2 * Math.round(0.5 * expectedWidth * data.height / data.width)
		} else {
			throw Error('Unknown constraint.')
		}

		let pixelRate = expectedWidth * expectedHeight / basePixels - 1
		if (!compareNumber(pixelRate, 1)) {
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

	const bitrate = adjustBitrate(ctx.data, vnt)
	const options = new FFmpegVideoOptions(vnt.friendlyCodecId, bitrate, vnt.encodeOptions)
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
