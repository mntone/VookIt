import { Media } from '../encoders/Codec.mjs'
import { Extension } from '../encoders/Variant.mjs'

import { TuneConfig } from './TuneConfig.mjs'
import { VariantConfig } from './VariantConfig.mjs'

export type Software = 'ffmpeg'

export type CodecConfig = {
	/**
	 * Media type
	 */
	type: Media

	/**
	 * Codec ID
	 */
	id: number

	/**
	 * User-friendly codec ID
	 */
	idstr: string

	/**
	 * Is codec enabled
	 * @defaultValue  `true`
	 */
	enabled?: boolean

	/**
	 * Is public data
	 * @defaultValue  `false`
	 */
	public?: boolean

	/**
	 * Runs on queue name.
	 * @defaultValue  `'encode'`
	 */
	runsOn?: string

	/**
	 * Encoder software
	 */
	uses: Software

	/**
	 * Output file extension
	 */
	ext: Extension

	/**
	 * Mime type and codec
	 */
	mime: string

	/**
	 * Audio codec ID
	 */
	audios: string[] | string

	/**
	 * Is HLS use
	 * @defaultValue  `false`
	 */
	useHls?: boolean

	/**
	 * Encode options
	 */
	options: { [name: string]: string | number | boolean }

	/**
	 * Specific tune
	 */
	tune: TuneConfig

	/**
	 * Variants
	 */
	variants: VariantConfig[]
}
