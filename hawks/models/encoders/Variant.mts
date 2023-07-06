import { Media } from './Codec.mjs'
import { EncodeOptions } from './EncodeOptions.mjs'
import { Tune } from './Tune.mjs'

export type Extension = '.jpg' | '.jpeg' | '.m4a' | '.m4v' | '.mp4' | '.opus' | '.webm' | '.webp'

export type Variant = {
	/**
	 * Media type
	 */
	type: Media

	/**
	 * Variant ID
	 */
	id: number

	/**
	 * User-friendly variant ID
	 */
	friendlyId: string

	/**
	 * User-friendly codec ID
	 */
	friendlyCodecId: string

	/**
	 * Is variant enabled
	 */
	enabled: boolean

	/**
	 * Is public data
	 */
	public: boolean

	/**
	 * Queue name
	 */
	queueName?: string

	/**
	 * Filename
	 */
	filename?: string

	/**
	 * File extension
	 */
	fileExtension: Extension

	/**
	 * Mime type and codec
	 */
	mimeType: string

	/**
	 * Audio codec ID
	 */
	audioCodecIds: string[]

	/**
	 * Is HLS use
	 */
	useHls: boolean

	/**
	 * Bitrate
	 */
	bitrate?: number

	/**
	 * Encode options
	 */
	encodeOptions: EncodeOptions

	/**
	 * Tune
	 */
	tune: Readonly<Tune>
}
