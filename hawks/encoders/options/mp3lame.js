const FFmpegOptions = require('./ffmpeg')
const FFmpegAudioOptions = require('./ffmpeg-audio')

class Mp3LameOptions extends FFmpegAudioOptions {
	/**
	 * @param {object?} options
	 * @param {boolean} options.abr
	 */
	constructor(options) {
		super(FFmpegAudioOptions.Codec.MP3_LAME, '192k')
		this.abr = options && options.abr || false
	}

	/**
	 * @param {object} args
	 */
	_buildOverride(args) {
		if (this.abr) {
			args['abr'] = true
		}
	}

	/**
	 * Get audio codec.
	 * @type {symbol}
	 */
	get codec() {
		return super.codec
	}
	/**
	 * @type {symbol}
	 */
	set codec(_) {
		throw Error('This function cannot be called in this class.')
	}

	/**
	 * Get rate control mode.
	 * @type {symbol}
	 */
	get rateControl() {
		return super.rateControl
	}
	/**
	 * Set rate control mode.
	 * @type {symbol}
	 */
	set rateControl(value) {
		if (value === FFmpegOptions.RateControl.VBR) {
			throw Error(`This value (${value.toString()}) is invalid.`)
		}
		super.rateControl = value
	}

	/**
	 * Get abr state.
	 * @type {boolean}
	 */
	get abr() {
		return this.rateControl === FFmpegOptions.RateControl.ABR
	}
	/**
	 * Set abr state.
	 * @type {boolean}
	 */
	set abr(value) {
		super.rateControl = value
			? FFmpegOptions.RateControl.ABR
			: FFmpegOptions.RateControl.CBR
	}
}

module.exports = Mp3LameOptions
