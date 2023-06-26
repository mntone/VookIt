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
import { getFramerate } from '../../models/Framerate.mjs'
import { getEncodeFileinfo } from '../../utils/fileSupport.mjs'

const EPSILON = 0.000001
const BASE_LOG_PIXELS = Math.log(1280 * 720)
const BASE_FRAMERATE = 30

function compareNumber(a, b) {
	return Math.abs(a - b) < EPSILON
}

function calcWidthAs16over9(height) {
	return 2 * Math.round(height * 8 / 9)
}

// Calc "Kashikoi" Bitrate. It means adaptive clever bitrate.
function adjustBitrate(ctx: VideoEncodeContext, vnt: Variant) {
	if (vnt.bitrate) {
		let expectedWidth, expectedHeight, basePixels
		if (typeof vnt.encodeOptions.maxSize === 'string' && vnt.encodeOptions.maxSize.indexOf('x') !== -1) {
			[expectedWidth, expectedHeight] = vnt.encodeOptions.maxSize.split('x', 2).map(l => Number(l))
			basePixels = calcWidthAs16over9(expectedHeight) * expectedHeight

			if (ctx.width / expectedWidth < ctx.height / expectedHeight) {
				expectedWidth = 2 * Math.round(0.5 * expectedHeight * ctx.width / ctx.height)
			} else {
				expectedHeight = 2 * Math.round(0.5 * expectedWidth * ctx.height / ctx.width)
			}
		} else if (typeof vnt.encodeOptions.maxHeight === 'number') {
			expectedHeight = vnt.encodeOptions.maxHeight
			basePixels = calcWidthAs16over9(expectedHeight) * expectedHeight

			expectedWidth = 2 * Math.round(0.5 * expectedHeight * ctx.width / ctx.height)
		} else if (typeof vnt.encodeOptions.maxWidth === 'number') {
			expectedWidth = vnt.encodeOptions.maxWidth
			basePixels = expectedWidth * (2 * Math.round(expectedWidth * 9 / 32))

			expectedHeight = 2 * Math.round(0.5 * expectedWidth * ctx.height / ctx.width)
		} else {
			throw Error('Unknown constraint.')
		}

		let pixelRate = expectedWidth * expectedHeight / basePixels - 1
		if (!compareNumber(pixelRate, 1)) {
			pixelRate *= pixelRate > 0
				? vnt.tune.decreaseBitrateMultiplier
				: vnt.tune.increaseBitrateMultiplier
		}

		const framerate = getFramerate(ctx.framerate)
		const expectedFramerate = vnt.encodeOptions.maxFramerate ? Math.min(framerate, vnt.encodeOptions.maxFramerate) : framerate
		const framerateMultiplier = 1 + 0.5 * (expectedFramerate / BASE_FRAMERATE - 1)
		const bitrate = vnt.bitrate * (1 + pixelRate) * framerateMultiplier
		return bitrate
	} else {
		const pixels = ctx.width * ctx.height
		let pixelMultiplier = 2 - Math.log(pixels) / BASE_LOG_PIXELS
		if (!compareNumber(pixelMultiplier, 1)) {
			pixelMultiplier = pixelMultiplier > 1
				? pixelMultiplier / vnt.tune.decreaseBitrateMultiplier
				: pixelMultiplier * vnt.tune.increaseBitrateMultiplier
		}

		const frameMultiplier = BASE_FRAMERATE + 0.5 * (getFramerate(ctx.framerate) - BASE_FRAMERATE)
		const bitrate = vnt.tune.bitsPerPixel * pixels * pixelMultiplier * frameMultiplier
		return bitrate
	}
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
