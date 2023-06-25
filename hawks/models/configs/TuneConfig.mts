
export type TuneConfig = {
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
