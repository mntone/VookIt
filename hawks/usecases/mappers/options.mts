import { ColorRange, MatrixCoefficients, TransferCharacteristics } from '../../models/Colors.mjs'
import { EncodeOptions, Encoder, PixelFormat, ResizeMethod, ResizeMode } from '../../models/encoders/EncodeOptions.mjs'
import { Size, parseSize } from '../../models/Size.mjs'

function getValidResizeMode(resizeMode: string | undefined): ResizeMode | undefined {
	switch (resizeMode) {
	case undefined:
	case 'fit':
	case 'fill':
	case 'crop':
		return resizeMode
	default:
		throw new Error('Unknown resize mode.')
	}
}

function getValidResizeMethod(resizeMethod: string | undefined): ResizeMethod | undefined {
	switch (resizeMethod) {
	case undefined:
	case 'nearest':
	case 'bilinear':
	case 'bicubic':
	case 'spline16':
	case 'spline36':
	case 'lanczos':
		return resizeMethod
	default:
		throw new Error('Unknown resize method.')
	}
}

function getValidColorRange(colorRange: string | undefined): ColorRange | undefined {
	switch (colorRange) {
	case undefined:
	case 'tv':
	case 'pc':
		return colorRange
	default:
		throw new Error('Unknown color range.')
	}
}

function getValidTransferCharacteristics(transferCharacteristics: string | undefined): TransferCharacteristics | undefined {
	switch (transferCharacteristics) {
	case undefined:
	case 'bt709':
	case 'bt470m':
	case 'bt470bg':
	case 'smpte170m':
	case 'smpte240m':
	case 'linear':
	case 'log100':
	case 'log316':
	case 'xvycc':
	case 'bt1361':
	case 'srgb':
	case 'bt2020-10':
	case 'bt2020-12':
	case 'pq':
	case 'smpte428':
	case 'hlg':
		return transferCharacteristics
	default:
		throw new Error('Unknown transfer characteristics.')
	}
}

function getValidMatrixCoefficients(matrixCoefficients: string | undefined): MatrixCoefficients | undefined {
	switch (matrixCoefficients) {
	case undefined:
	case 'bt709':
	case 'fcc':
	case 'bt470bg':
	case 'smpte170m':
	case 'smpte240m':
	case 'ycocg':
	case 'gbr':
	case 'bt2020nc':
	case 'bt2020c':
	case 'smpte2085':
		return matrixCoefficients
	default:
		throw new Error('Unknown matrix coefficients.')
	}
}

function getValidCodec(codec: string | undefined): Encoder | undefined {
	switch (codec) {
	case undefined:
	case 'libx264':
	case 'libx265':
	case 'libvpx':
	case 'libvpx-vp9':
	case 'libaom-av1':
	case 'libmp3lame':
	case 'aac':
	case 'aac_at':
	case 'libopus':
		return codec
	default:
		throw new Error('Unknown codec.')
	}
}

function getValidPixelFormat(pixelFormat: string | undefined): PixelFormat | undefined {
	switch (pixelFormat) {
	case undefined:
	case 'yuv420p':
	case 'yuv420p10le':
		return pixelFormat
	default:
		throw new Error('Unknown pixel format.')
	}
}

export function mapOptions(
	config: Record<string, string | number | boolean | undefined>,
	base: Record<string, string | number | boolean | undefined>,
): EncodeOptions {
	const merged = { ...base, ...config }
	const {
		resizeMode,
		resizeMethod,
		colorRange,
		transferCharacteristics,
		matrixCoefficients,
		codec,
		pixelFormat,
		maxWidth,
		maxHeight,
		maxSize,
		maxFramerate,
		...additionalPairs
	} = merged

	let { width: mergedMaxWidth, height: mergedMaxHeight }: Partial<Size> = parseSize(maxSize as string)
	if (Number.isNaN(maxWidth)) {
		if (Number.isNaN(maxWidth)) {
			mergedMaxWidth = undefined
		} else {
			mergedMaxWidth = maxWidth as number
		}
	}
	if (Number.isNaN(maxHeight)) {
		if (Number.isNaN(maxHeight)) {
			mergedMaxHeight = undefined
		} else {
			mergedMaxHeight = maxHeight as number
		}
	}

	const options: EncodeOptions = {
		resizeMode: getValidResizeMode(resizeMode as string),
		resizeMethod: getValidResizeMethod(resizeMethod as string),
		colorRange: getValidColorRange(colorRange as string),
		transferCharacteristics: getValidTransferCharacteristics(transferCharacteristics as string),
		matrixCoefficients: getValidMatrixCoefficients(matrixCoefficients as string),
		codec: getValidCodec(codec as string),
		pixelFormat: getValidPixelFormat(pixelFormat as string),
		maxWidth: mergedMaxWidth,
		maxHeight: mergedMaxHeight,
		maxFramerate: !Number.isNaN(maxFramerate) ? maxFramerate as number : undefined,
		...additionalPairs,
	}
	return options
}
