const FFmpegOptions = require('./ffmpeg')

class FFmpegAudioOptions extends FFmpegOptions {
	/**
	 * Audio channel
	 * @type {number}
	 */
	#channel

	#params

	/**
	 * @param {number} bitrate
	 * @param {object} params
	 */
	constructor(
		bitrate = 128 * 1024,
		params = undefined) {
		super(bitrate)

		if (typeof params.codec !== 'string') {
			throw new Error('The codec is invalid.')
		}

		this.#channel = 2
		this.#params = params || {}
	}

	/**
	 * Build args override.
	 * @param {object} args
	 */
	_buildOverride(args) {
		delete args.threads

		const args2 = {
			map: '0:a:0',
			acodec: this.#params.codec,
			ac: this.channel,
			['b:a']: this.bitrate,
		}
		Object.assign(args, args2)

		if (Array.isArray(this.#params.sampleRate)) {
			args['af'] = 'aformat=sample_rates=' + this.#params.sampleRate.join('|')
		} else if (typeof this.#params.sampleRate === 'number') {
			args['af'] = 'aformat=sample_rates=' + this.#params.sampleRate
		}

		switch (this.#params.codec) {
		case 'libmp3lame':
			args['strict'] = 'unofficial'
			break
		case 'aac':
		case 'aac_at':
			args['strict'] = 'experimental'
			break
		default:
			break
		}
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
		if (this.#params.codec === 'libmp3lame') {
			return 320 * 1024 /* 320 KB */
		} else {
			return FFmpegOptions._upperLimitBitrate()
		}
	}
}

module.exports = FFmpegAudioOptions
