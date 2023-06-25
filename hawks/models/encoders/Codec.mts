import { Variant } from './Variant.mjs'

export const MediaType = Object.freeze({
	AUDIO: 'audio',
	IMAGE: 'image',
	VIDEO: 'video',
})

export type Media = Lowercase<keyof typeof MediaType>

export type CodecBase = {
	/**
	 * Codec ID
	 */
	id: number

	/**
	 * User-friendly codec ID
	 */
	friendlyId: string

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
	queueName: string

	/**
	 * Variants
	 */
	variants: Readonly<Variant>[]
}

export type AudioCodec = {
	type: 'audio'
} & CodecBase

export type ImageCodec = {
	type: 'image'
} & CodecBase

export type VideoCodec = {
	type: 'video'
} & CodecBase

export type Codec = AudioCodec | ImageCodec | VideoCodec
