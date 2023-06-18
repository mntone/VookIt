const { isMac } = require('../../utils/OSSupport')

const FFmpegOptions = require('./ffmpeg')

class FFmpegAudioOptions extends FFmpegOptions {
	/**
	 * Audio codec
	 * @type {symbol}
	 */
	#codec

	/**
	 * Audio channel
	 * @type {number}
	 */
	#channel

	#params

	/**
	 * @param {symbol|string|null|undefined} codec
	 * @param {string}                       bitrate
	 * @param {object}                       params
	 */
	constructor(
		codec,
		bitrate = 128 * 1024,
		params = undefined) {
		super(bitrate)

		this.#codec = FFmpegOptions._getNormalizedValue(
			codec,
			isMac()
				? FFmpegAudioOptions.Codec.AAC_AUDIOTOOLBOX
				: FFmpegAudioOptions.Codec.AAC,
			FFmpegAudioOptions.isCodecValid,
			FFmpegAudioOptions.parseCodec,
		)
		this.#channel = 2
		this.#params = params || {}
	}

	/**
	 * Build args override.
	 * @param {object} args
	 */
	_buildOverride(args) {
		const args2 = {
			map: '0:a:0',
			acodec: this.codec.description,
			ac: this.channel,
			b: this.bitrate,
		}
		Object.assign(args, args2)

		if (Array.isArray(this.#params.sampleRate)) {
			args['af'] = 'aformat=sample_rates=' + this.#params.sampleRate.join('|')
		} else if (typeof this.#params.sampleRate === 'number') {
			args['af'] = 'aformat=sample_rates=' + this.#params.sampleRate
		}

		switch (this.codec) {
		case FFmpegAudioOptions.Codec.MP3_LAME:
			args['strict'] = 'unofficial'
			break
		case FFmpegAudioOptions.Codec.AAC:
			args['strict'] = 'experimental'
			break
		default:
			break
		}
	}

	/**
	 * Get audio codec.
	 * @type {symbol}
	 */
	get codec() {
		return this.#codec
	}
	/**
	 * Set audio codec.
	 * @type {symbol}
	 */
	set codec(value) {
		if (FFmpegAudioOptions.isCodecValid(value)) {
			throw Error(`This value (${value.toString()}) is invalid.`)
		}
		if (!isMac && value === FFmpegAudioOptions.Codec.AAC_AUDIOTOOLBOX) {
			console.warn('AAC_AUDIOTOOLBOX is not supported. This is macOS only.')
			value = FFmpegAudioOptions.Codec.AAC
		}
		this.#codec = value
	}

	/**
	 * Get audio channels.
	 * @type {number}
	 */
	get channel() {
		return this.#channel
	}
	/**
	 * Set audio channels.
	 * @type {number}
	 */
	set channel(value) {
		if (value !== 1 && value !== 2) {
			console.warn('Audio channels limit mono or stereo.')
			value = Math.max(1, Math.min(2, value))
		}
		this.#channel = value
	}

	static _upperLimitBitrate() {
		if (this.codec === FFmpegAudioOptions.Codec.MP3_LAME) {
			return 320 * 1024 /* 320 KB */
		} else {
			return FFmpegOptions._upperLimitBitrate()
		}
	}

	/**
	 * Is audio codec valid.
	 * @param   {symbol}  codec
	 * @returns {boolean}
	 */
	static isCodecValid(codec) {
		return Object.values(FFmpegAudioOptions.Codec).includes(codec)
	}

	/**
	 * Parse audio codec.
	 * @param   {string} str
	 * @returns {symbol}
	 */
	static parseCodec(str) {
		let ret
		switch (str.toLowerCase()) {
		case 'mp3':
		case 'lame':
		case 'libmp3lame':
			ret = FFmpegAudioOptions.Codec.MP3_LAME
			break
		case 'aac':
		case 'mp4a':
			ret = FFmpegAudioOptions.Codec.AAC
			break
		case 'aac_at':
		case 'aac_audiotoolbox':
			ret = FFmpegAudioOptions.Codec.AAC_AUDIOTOOLBOX
			break
		case 'opus':
		case 'libopus':
			ret = FFmpegAudioOptions.Codec.OPUS
			break
		default:
			throw Error(`This value (${str.toString()}) is invalid.`)
		}
		return ret
	}
}

FFmpegAudioOptions.Codec = Object.freeze({
	// MP3
	MP3_LAME: Symbol('libmp3lame'),

	// AAC
	AAC: Symbol('aac'),
	AAC_AUDIOTOOLBOX: Symbol('aac_at'), // macOS only

	// Opus
	OPUS: Symbol('libopus'),
})

module.exports = FFmpegAudioOptions
