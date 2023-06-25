import { readFile } from 'fs/promises'

import { glob } from 'glob'
import { load as yamlLoad } from 'js-yaml'

// @ts-ignore
import env from '../../../constants/env.js'
import { CodecConfig } from '../../models/configs/CodecConfig.mjs'
import { AudioCodec, Codec, ImageCodec, Media, VideoCodec } from '../../models/encoders/Codec.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { mapCodec } from '../mappers/codec.mjs'

type FormatConfigLoaderOptions = {
	pattern: string

	loader: (str: string) => CodecConfig
}

type CodecByType = {
	audio: Readonly<AudioCodec>[],
	image: Readonly<ImageCodec>[],
	video: Readonly<VideoCodec>[],
}

export class CodecConfigLoader {
	#options: FormatConfigLoaderOptions
	#codecByType: Readonly<CodecByType> = {
		audio: [],
		image: [],
		video: [],
	}
	#codecById: Readonly<{ [key: number]: Codec }> = {}
	#codecByFriendlyId: Readonly<{ [key: string]: Codec }> = {}
	#variantById: Readonly<{ [key: number]: Variant }> = {}
	#queues: readonly string[] = []

	private constructor(options?: FormatConfigLoaderOptions) {
		this.#options = options || {
			pattern: '*.format.{yml,yaml}',
			loader: yamlLoad as (str: string) => CodecConfig,
		}
	}

	async load() {
		const configPathes = await glob('./hawks/configs/' + this.#options.pattern)
		const configStrs = await Promise.all(configPathes.map(path => readFile(path, 'utf8')))
		const configs = configStrs.map(this.#options.loader)
		this.#preprocess(configs)
		return configs
	}

	#preprocess(configs: CodecConfig[]) {
		const codecs = configs.filter(c => c.enabled !== false).map(c => mapCodec(c))
		if (codecs.length === 0) {
			throw Error('All codecs do not exist.')
		}

		const codecByType: CodecByType = {
			audio: [],
			image: [],
			video: [],
		}
		for (const codec of codecs) {
			switch (codec.type) {
			case 'audio':
				codecByType.audio.push(codec)
				break
			case 'image':
				codecByType.image.push(codec)
				break
			case 'video':
				codecByType.video.push(codec)
				break
			default: {
				const _exhaustiveCheck: never = codec
				throw Error('Unreachable: ' + _exhaustiveCheck)
			}
			}
		}

		// Require one codec setting of each type at least.
		if (codecByType.audio.length === 0) {
			throw Error('Audio codecs do not exist.')
		}
		if (codecByType.image.length === 0) {
			throw Error('Image codecs do not exist.')
		}
		if (codecByType.video.length === 0) {
			throw Error('Video codecs do not exist.')
		}

		// Sort by codecID
		codecByType.audio.sort((ca, cb) => ca.id - cb.id)
		codecByType.image.sort((ca, cb) => ca.id - cb.id)
		codecByType.video.sort((ca, cb) => ca.id - cb.id)

		this.#codecByType = codecByType

		// Codec by ID
		this.#codecById = Object.freeze(Object.fromEntries(codecs.sort(c => c.id).map(c => [c.id, c])))

		// Codec by Friendly ID
		this.#codecByFriendlyId = Object.freeze(Object.fromEntries(codecs.map(c => [c.friendlyId, c])))

		// Variant by ID
		this.#variantById = Object.freeze(Object.fromEntries(codecs.flatMap(c => c.variants).sort((va, vb) => va.id - vb.id).map(v => [v.id, v])))

		// Get all queue names
		const allQueueNames = Object.keys(env.hawksQueues)
			.concat(codecs.map(c => c.queueName))
			.concat(codecs
				.flatMap(c => c.variants)
				.map(v => v.queueName)
				.filter((q): q is NonNullable<typeof q> => q != null))
			.reduce((ary: string[], queueName) => {
				if (queueName && ary.indexOf(queueName) === -1) {
					ary.push(queueName)
				}
				return ary
			}, [])
		this.#queues = allQueueNames
	}

	codecsBy(type: Media) {
		return this.#codecByType[type]
	}

	codecBy(codecId: number): Codec
	codecBy(codecId: string): Codec
	codecBy(codecId: number|string) {
		if (typeof codecId === 'string') {
			return this.#codecByFriendlyId[codecId]
		} else {
			return this.#codecById[codecId]
		}
	}

	get audio() {
		return this.#codecByType.audio
	}

	get image() {
		return this.#codecByType.image
	}

	get video() {
		return this.#codecByType.video
	}

	variantBy(variantId: number) {
		return this.#variantById[variantId]
	}
	get queues() {
		return this.#queues
	}

	static get instance() {
		return CodecConfigLoader.#instance
	}

	static #instance: CodecConfigLoader = new CodecConfigLoader()
}
