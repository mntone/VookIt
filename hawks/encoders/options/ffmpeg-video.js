const FFmpegOptions = require('./ffmpeg')

class FFmpegVideoOptions extends FFmpegOptions {
	static #superPropertyNames = ['threads']

	#params

	/**
	 * @param {number}  bitrate
	 * @param {object}  params
	 * @param {string?} params.filters
	 */
	constructor(
		bitrate = 1 * 1024 * 1024,
		params = undefined) {
		super(bitrate, FFmpegOptions._getSuperParams(params, FFmpegVideoOptions.#superPropertyNames))

		if (typeof params.codec !== 'string') {
			throw new Error('The codec is invalid.')
		}

		this.#params = params || {}
	}

	/**
	 * Build args override.
	 * @param {object} args
	 */
	_buildOverride(args) {
		const args2 = {
			map: '0:v:0',
			vcodec: this.#params.codec,
			['tag:v']: this.tag ?? false,
		}

		switch (this.#params.codec) {
		case 'libx264':
			args2['profile:v'] = this.#params.profile || 'high'
			args2['preset'] = this.#params.preset || 'slow'
			break
		case 'libx265':
			args2['profile:v'] = this.#params.profile || 'main'
			args2['preset'] = this.#params.preset || 'slow'
			break
		case 'libsvtav1':
			args2['preset'] = this.#params.preset || 1
			args2['svtav1-params'] = this.#params['svtav1-params'] || false
			break
		default:
			throw new Error(`The codec ${this.#params.codec} is invalid.`)
		}

		if (typeof this.#params.filters === 'string') {
			args2['vf'] = this.#params.filters
		}
		if (typeof this.#params.pixelFormat === 'string') {
			args2['pix_fmt'] = this.#params.pixelFormat
		}
		if (typeof this.#params.maxFramerate === 'number') {
			args2['fpsmax'] = this.#params.maxFramerate
		}
		if (true) {
			const keyint = 4
			args2['force_key_frames'] = `expr:gte(t,n_forced*${Math.max(1, Math.min(4, keyint))})`
		}

		args2['b:v'] = this.bitrate

		Object.assign(args, args2)
	}

	/**
	 * Apply bitrate correction
	 * @param   {number} bitrate
	 * @returns {number}
	 */
	_applyBitrateCorrection(bitrate) {
		return Math.round(bitrate / 1000) * 1000
	}
}

module.exports = FFmpegVideoOptions
