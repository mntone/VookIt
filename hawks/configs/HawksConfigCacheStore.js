const env = require('../../constants/env')
const ConfigCacheStore = require('../../utils/configs/ConfigCacheStore')
const { removeSIPrefixIfNeeded } = require('../../utils/DataSizeSupport')
const { parseCodec: parseAudioCodec } = require('../encoders/options/ffmpeg-audio')
const FFmpegVideoOptions = require('../encoders/options/ffmpeg-video')

class HawksConfigCacheStore extends ConfigCacheStore {
	#variantsById = {}

	constructor() {
		super(__dirname, env.hawksConfigsFormat)
	}

	formatBy(id) {
		const format = this.#variantsById[id]
		return format
	}

	loadFormat(formatName) {
		return super.load(formatName + '.format')
	}

	loadFormatSync(formatName) {
		return super.loadSync(formatName + '.format')
	}

	/**
	 * @param {string} name   Config filename.
	 * @param {object} config Config object.
	 */
	_process(name, config) {
		if (name === 'workers') {
			return
		}

		if (name === 'workflows') {
			this.#processFormatConfig(config)
			return
		}

		switch (config.type) {
		case 'video':
			if (config.codec) {
				config.codec = FFmpegVideoOptions.parseCodec(config.codec)
			}
			if (config.pixelFormat) {
				config.pixelFormat = FFmpegVideoOptions.parsePixelFormat(config.pixelFormat)
			}
			break
		case 'audio':
			if (config.codec) {
				config.codec = parseAudioCodec(config.codec)
			}
			break
		default:
			break
		}

		if (!config.enabled) {
			config.variants = []
			return
		}

		const variantsById = {}
		for (const variant of config.variants) {
			if (variant.type) {
				throw Error('This variable `variants.type` cannot override. Please create other format file.')
			}
			variant.type = config.type
			if (variant.ext == null && config.ext) {
				variant.ext = config.ext
			}
			if (variant.encoder == null) {
				variant.encoder = config.encoder
			} else {
				variant.encoder = { ...config.encoder, ...variant.encoder }
			}
			if (variant.bitrate) {
				variant.bitrate = removeSIPrefixIfNeeded(variant.bitrate)
			}

			variantsById[variant.id] = variant
		}
		config.variantsById = variantsById // [TODO] remove
		Object.assign(this.#variantsById, variantsById)

		const variantsByGroup = {}
		for (const variant of config.variants) {
			if (variant.group) {
				for (const group of variant.group) {
					if (variantsByGroup[group]) {
						variantsByGroup[group].push(variant)
					} else {
						variantsByGroup[group] = [variant]
					}
				}
			}
		}
		if (Object.keys(variantsByGroup).length !== 0) {
			config.variantsByGroup = variantsByGroup
		}
	}

	#processFormatConfig(config) {
		const idProd = process.env.NODE_ENV !== 'development'
		for (const workflow of Object.values(config.workflows)) {
			for (const item of workflow.flows) {
				for (const encode of item.encodes) {
					encode.includes = this.#expandFormatIds(encode.name)
				}

				if (item.postprocesses) {
					for (const postprocess of item.postprocesses) {
						if (postprocess.includesNames) {
							postprocess.includes = postprocess.includesNames.flatMap(this.#expandFormatIds.bind(this))
						}

						if (idProd) {
							delete postprocess.includes
						}
					}
				}
			}
		}
	}

	#expandFormatIds(formatNameOrGroupName) {
		const [format, formatGroup] = formatNameOrGroupName.split(':', 2)
		const formatConfig = this.loadFormatSync(format)
		if (!formatConfig.enabled) {
			return []
		}

		let variants
		if (formatGroup) {
			variants = formatConfig.variantsByGroup[formatGroup]
		} else {
			variants = formatConfig.variants
		}

		const formatIds = variants.filter(f => f.enabled).map(f => f.id)
		return formatIds
	}
}

module.exports = new HawksConfigCacheStore()
