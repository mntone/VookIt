
export type TuneConfig = {
	/**
	 * Bits per Pixel
	 * @defaultValue  `0.11` (H.264/AVC), `0.055` (AV1)
	 */
	bpp: number

	/**
	 * Increasing multiplier to bitrate for pixel ratio relative to 16:9.
	 * @defaultValue  `1.0`
	 */
	increase: number

	/**
	 * Decreasing multiplier to bitrate for pixel ratio relative to 16:9.
	 * @defaultValue  `1.0`
	 */
	decrease: number
}
