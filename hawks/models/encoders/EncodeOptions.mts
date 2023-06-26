
export type Encoder = 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'libaom-av1' | 'libmp3lame' | 'aac' | 'aac_at' | 'libopus'

export type EncodeOptions = {
	/**
	 * Encoder
	 */
	codec?: Encoder

	/**
	 * Pixel format
	 */
	pixelFormat?: string

	/**
	 * Max width
	 */
	maxWidth?: number

	/**
	 * Max height
	 */
	maxHeight?: number

	/**
	 * Max size
	 */
	maxSize?: string

	/**
	 * Max framerate
	 */
	maxFramerate?: number
}
