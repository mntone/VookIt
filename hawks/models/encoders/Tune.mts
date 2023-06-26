
export type Tune = {
	/**
	 * Bits per Pixel
	 * @defaultValue  `0.075` (H.264/AVC), `0.055` (AV1)
	 */
	bitsPerPixel: number

	/**
	 * Increase bitrate multiplier
	 */
	increaseBitrateMultiplier: number

	/**
	 * Decrease bitrate multiplier
	 */
	decreaseBitrateMultiplier: number
}
