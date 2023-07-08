import { ColorRange, MatrixCoefficients, TransferCharacteristics } from '../Colors.mjs'

export type ResizeMode = 'fit' | 'fill' | 'crop'

export type ResizeMethod = 'nearest' | 'bilinear' | 'bicubic' | 'spline16' | 'spline36' | 'lanczos'

export type Encoder = 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'libaom-av1' | 'libsvtav1' | 'libmp3lame' | 'aac' | 'aac_at' | 'libopus'

export type PixelFormat = 'yuv420p' | 'yuv420p10le'

export type EncodeOptions = {
	/**
	 * Resize mode
	 */
	resizeMode?: ResizeMode

	/**
	 * Resize method
	 */
	resizeMethod?: ResizeMethod

	/**
	 * Color range
	 */
	colorRange?: ColorRange

	/**
	 * Transfer characteristics
	 */
	transferCharacteristics?: TransferCharacteristics

	/**
	 * Matrix coefficients
	 */
	matrixCoefficients?: MatrixCoefficients

	/**
	 * Encoder
	 */
	codec?: Encoder

	/**
	 * Pixel format
	 */
	pixelFormat?: PixelFormat

	/**
	 * Max width
	 */
	maxWidth?: number

	/**
	 * Max height
	 */
	maxHeight?: number

	/**
	 * Max framerate
	 */
	maxFramerate?: number

	/**
	 * Additional key-value pairs
	 */
	[key: string]: string[] | string | number | boolean | undefined
}
