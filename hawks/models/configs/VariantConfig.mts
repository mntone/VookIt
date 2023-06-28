import { TuneConfig } from './TuneConfig.mjs'

export type VariantConfig = {
	/**
	 * Variant ID
	 */
	id: number

	/**
	 * User-friendly variant ID
	 */
	idstr: string

	/**
	 * Is variant enabled
	 * @defaultValue  `true`
	 */
	enabled?: boolean

	/**
	 * Runs on queue name.
	 * @defaultValue `CodecConfig.runsOn || 'encode'`
	 */
	runsOn?: string

	/**
	 * Filename
	 */
	filename?: string

	/**
	 * Bitrate
	 */
	bitrate: string | number | undefined

	/**
	 * Encode options
	 */
	options: Record<string, string | number | boolean>

	/**
	 * Specific tune
	 */
	tune?: TuneConfig
}
