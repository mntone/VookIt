import { existsSync } from 'fs'

import FFmpegImageOptions from '../../encoders/options/ffmpeg-image.js'
import { ImageData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { Size } from '../../models/Size.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getOutputFilepath } from '../../utils/fileSupport.mjs'
import { CropFilter, Filters, PadFilter, VideoFilter } from '../filters/index.mjs'
import { ffmpeg, getAwaiter } from '../trampolines/ffmpeg.mjs'

function getExpectedSize(data: ImageData, vnt: Variant): Size {
	const expectedSize: Size = {
		width: data.width,
		height: data.height,
	}

	if (vnt.encodeOptions.maxWidth) {
		if (vnt.encodeOptions.maxHeight) {
			expectedSize.width = vnt.encodeOptions.maxWidth
			expectedSize.height = vnt.encodeOptions.maxHeight

			switch (vnt.encodeOptions.resizeMode) {
			case 'crop':
				if (data.width / expectedSize.width >= data.height / expectedSize.height) {
					expectedSize.width = 2 * Math.round(0.5 * expectedSize.height * data.width / data.height)
				} else {
					expectedSize.height = 2 * Math.round(0.5 * expectedSize.width * data.height / data.width)
				}
				break
			case 'fit':
			// case 'pad':
				if (data.width / expectedSize.width < data.height / expectedSize.height) {
					expectedSize.width = 2 * Math.round(0.5 * expectedSize.height * data.width / data.height)
				} else {
					expectedSize.height = 2 * Math.round(0.5 * expectedSize.width * data.height / data.width)
				}
				break
			default:
				break
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

	const expectedSize = getExpectedSize(ctx.data, vnt)
	const filter = new VideoFilter(ctx.data, { useSwscaleForResize: true })
		.resizeMethod(vnt.encodeOptions.resizeMethod)
		.size(expectedSize)
		.colorRange(vnt.encodeOptions.colorRange)
		.colorPrimaries('bt709')
		.transferCharacteristics(vnt.encodeOptions.transferCharacteristics)
		.matrixCoefficients(vnt.encodeOptions.matrixCoefficients)
	const filters = new Filters('video', vnt.encodeOptions.postFilters as string[])
	filters.filters.unshift(filter)

	if (vnt.encodeOptions.maxWidth && vnt.encodeOptions.maxHeight && (vnt.encodeOptions.maxWidth !== expectedSize.width || vnt.encodeOptions.maxHeight !== expectedSize.height)) {
		switch (vnt.encodeOptions.resizeMode) {
		case 'crop':
			filters.add(new CropFilter()
				.width(vnt.encodeOptions.maxWidth)
				.height(vnt.encodeOptions.maxHeight)
				.cropX(Math.round(0.5 * (expectedSize.width - vnt.encodeOptions.maxWidth)))
				.cropY(Math.round(0.5 * (expectedSize.height - vnt.encodeOptions.maxHeight)))
				.exact(true),
			)
			break
		// case 'pad':
		// 	filters.add(new PadFilter()
		// 		.width(vnt.encodeOptions.maxWidth)
		// 		.height(vnt.encodeOptions.maxHeight)
		// 		.padX(Math.round(0.5 * (expectedSize.width - vnt.encodeOptions.maxWidth)))
		// 		.padY(Math.round(0.5 * (expectedSize.height - vnt.encodeOptions.maxHeight))),
		// 	)
		// 	break
		default:
			break
		}
	}
	// @ts-expect-error Fix interop error
	const options = new FFmpegImageOptions(vnt.friendlyCodecId, {
		...vnt.encodeOptions,
		filters: filters.build(),
	})
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
