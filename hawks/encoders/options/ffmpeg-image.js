const FFmpegOptions = require('./ffmpeg')

class FFmpegImageOptions extends FFmpegOptions {
	/**
	 * Image codec
	 * @type {symbol}
	 */
	#codec

	#params

	/**
	 * @param {symbol|string|null|undefined} codec
	 * @param {object}                       params
	 * @param {string?}                      params.maxSize
	 * @param {number?}                      params.quality [JPEG/WebP] Image quality (JPEG: 1-31, default ; WebP: 0-100, default 75)
	 * @param {number?}                      params.crf     [AVIF only]
	 * @param {number?}                      params.cpuUsed [AVIF only]
	 */
	constructor(
		codec,
		params = undefined) {
		super(0, { suppressBitrate: true })

		// Image codec
		this.#codec = FFmpegOptions._getNormalizedValue(
			codec,
			FFmpegImageOptions.Codec.JPEG,
			FFmpegImageOptions.isCodecValid,
			FFmpegImageOptions.parseCodec,
		)
		this.#params = params || {}
	}

	/**
	 * Build args override.
	 * @param {object} args
	 */
	_buildOverride(args) {
		const args2 = {
			map: '0:v:0',
			vcodec: this.codec.description,
			frames: 1,
			['b:v']: 0,
		}

		if (typeof this.#params.maxSize === 'string') {
			// [TODO] Portrait video
			const [width, height] = this.#params.maxSize.split('x').map(Number)
			switch (this.#params.resize) {
			case 'crop':
				args['vf'] = `scale=if(gte(${width}/iw\\,${height}/ih)\\,${width}\\,-2):if(gte(${width}/iw\\,${height}/ih)\\,-2\\,${height}),crop=${width}:${height}:(iw-ow)/2:(ih-oh)/2:exact=1`
				break
			// "vf:pad" has no chroma sampling option, and I decide no use this option
			// case 'pad':
			//	args['vf'] = `scale=if(lt(${width}/iw\\,${height}/ih)\\,${width}\\,-2):if(lt(${width}/iw\\,${height}/ih)\\,-2\\,${height}),pad=${width}:${height}:-1:-1`
			//	break
			case 'fill':
				args['vf'] = `scale=${width}:${height}`
				break
			default:
				args['vf'] = `scale=-2:${height}`
				break
			}
		} else {
			if (typeof this.#params.maxWidth === 'number') {
				args['vf'] = `scale=${this.#params.maxWidth}:-2`
			}
		}

		// Codec specified params
		switch (this.codec) {
		case FFmpegImageOptions.Codec.JPEG:
			if (typeof this.#params.quality === 'number') {
				args['qscale'] = this.#params.quality
			}
			break
		case FFmpegImageOptions.Codec.WEBP:
			if (typeof this.#params.quality === 'number') {
				args['quality'] = this.#params.quality
			}
			break
		case FFmpegImageOptions.Codec.AVIF:
			if (typeof this.#params.cpuUsed === 'number') {
				args['cpu-used'] = this.#params.cpuUsed
			}
			if (typeof this.#params.crf === 'number') {
				args['crf'] = this.#params.crf
			}
			break
		default:
			break
		}

		Object.assign(args, args2)
	}

	/**
	 * Get image codec.
	 * @type {symbol}
	 */
	get codec() {
		return this.#codec
	}
	/**
	 * Set image codec.
	 * @type {symbol}
	 */
	set codec(value) {
		if (FFmpegImageOptions.isCodecValid(value)) {
			throw Error(`This value (${value.toString()}) is invalid.`)
		}
		this.#codec = value
	}

	/**
	 * Is audio codec valid.
	 * @param   {symbol}  codec
	 * @returns {boolean}
	 */
	static isCodecValid(codec) {
		return Object.values(FFmpegImageOptions.Codec).includes(codec)
	}

	/**
	 * Parse image codec.
	 * @param   {string} str
	 * @returns {symbol}
	 */
	static parseCodec(str) {
		let ret
		switch (str.toLowerCase()) {
		case 'jpg':
		case 'jpeg':
		case 'mjpeg':
			ret = FFmpegImageOptions.Codec.JPEG
			break
		case 'vp8':
		case 'vp08':
		case 'webp':
			ret = FFmpegImageOptions.Codec.WEBP
			break
		case 'avif':
			ret = FFmpegImageOptions.Codec.AVIF
			break
		default:
			throw Error(`This value (${str.toString()}) is invalid.`)
		}
		return ret
	}
}

FFmpegImageOptions.Codec = Object.freeze({
	JPEG: Symbol('mjpeg'),
	WEBP: Symbol('libwebp'),
	AVIF: Symbol('libaom-av1'),
})

module.exports = FFmpegImageOptions
