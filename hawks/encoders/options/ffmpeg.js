const { removeSIPrefix, removeSIPrefixIfNeeded } = require('../../../utils/DataSizeSupport')
const toCommand = require('../utils/command')

class FFmpegOptions {
	#bitrate
	#minBitrate = '*0.9375'
	#maxBitrate = '*1.0625'

	/**
	 * Suppress bitrate command
	 * @type {boolean}
	 */
	#suppressBitrate

	/**
	 * Rate control mode
	 * @type {symbol}
	 */
	#rateControl

	/**
	 * Force tag (fourcc)
	 * @type {string}
	 */
	#tag

	/**
	 * Use threads
	 */
	#threads

	/**
	 * @param {number}  bitrate
	 * @param {object?} options
	 * @param {boolean} options.suppressBitrate
	 * @param {string?} options.tag
	 * @param {number?} options.threads
	 */
	constructor(bitrate, options) {
		if (options && options.suppressBitrate) {
			this.#bitrate = 0
			this.#suppressBitrate = true
			this.#rateControl = FFmpegOptions.RateControl.CBR
			this.#tag = null
			this.#threads = 1
		} else {
			const bitrate2 = removeSIPrefixIfNeeded(bitrate)
			if (bitrate2 <= 0) {
				throw Error(`This value (${bitrate.toString()}) is invalid.`)
			}

			const bitrate3 = this._applyBitrateCorrection(bitrate2)
			this.#bitrate = bitrate3
			this.#suppressBitrate = false
			this.#rateControl = FFmpegOptions.RateControl.CBR

			if (options) {
				if (options.tag) {
					if (options.tag.length !== 4) {
						throw Error(`This value (${options.tag.toString()}) is invalid length.`)
					}
					this.#tag = options.tag
				} else {
					this.#tag = null
				}

				if (typeof options.threads === 'number') {
					this.#threads = options.threads
				} else {
					this.#threads = 1
				}
			}
		}
	}

	/**
	 * @param   {object}             options
	 * @param   {string[] | string}  options.inputs
	 * @param   {string}             options.output
	 * @param   {string | undefined} options.keyPrefix
	 * @returns {string[]}
	 */
	build(options) {
		if (options.keyPrefix == null) {
			options.keyPrefix = '-'
		}

		const args = {
			y: true, // overwrite
			// eslint-disable-next-line camelcase
			hide_banner: true,
			nostdin: true,
			threads: this.#threads,
			i: options.inputs,
		}
		this._buildOverride(args, options)

		// Append output to the last
		if (this.#suppressBitrate) {
			const args2 = {
				[options.output]: null,
			}
			Object.assign(args, args2)
		} else {
			const args2 = {
				bufsize: this.bitrate,
				minrate: FFmpegOptions._getBitrateSyntax(this.minBitrate, this.bitrate, Math.ceil),
				maxrate: FFmpegOptions._getBitrateSyntax(this.maxBitrate, this.bitrate, Math.floor),
				[options.output]: null,
			}
			Object.assign(args, args2)
		}

		const command = toCommand(args)
		return command
	}

	/**
	 * Build args override.
	 * @param {object}          args
	 * @param {object}          options
	 * @param {string[]|string} options.inputs
	 * @param {string}          options.output
	 */
	// eslint-disable-next-line no-unused-vars
	_buildOverride(args, options) {
		// Nothing. But, overridable.
	}

	/**
	 * Apply bitrate correction
	 * @param   {number} bitrate
	 * @returns {number}
	 */
	_applyBitrateCorrection(bitrate) {
		return bitrate
	}

	/**
	 * Get bitrate.
	 * @type {number}
	 */
	get bitrate() {
		return this.#bitrate
	}
	/**
	 * Set bitrate.
	 * @type {string|number}
	 */
	set bitrate(value) {
		const bitrate = removeSIPrefixIfNeeded(value)
		if (bitrate <= 0) {
			throw Error(`This value (${value.toString()}) is invalid.`)
		}
		const bitrate2 = this._applyBitrateCorrection(bitrate)
		this.#bitrate = bitrate2
	}

	/**
	 * Get minimum bitrate.
	 * @type {number|string}
	 */
	get minBitrate() {
		return this.#minBitrate
	}
	/**
	 * Set minimum bitrate.
	 * @type {number|string}
	 */
	set minBitrate(value) {
		this.#minBitrate = value
	}

	/**
	 * Get maximum bitrate.
	 * @type {number|string}
	 */
	get maxBitrate() {
		return this.#maxBitrate
	}
	/**
	 * Set maximum bitrate.
	 * @type {number|string}
	 */
	set maxBitrate(value) {
		this.#maxBitrate = value
	}

	/**
	 * Get suppressing bitrate command.
	 * @type {boolean}
	 */
	get suppressBitrate() {
		return this.#suppressBitrate
	}

	/**
	 * Get rate control mode.
	 * @type {symbol}
	 */
	get rateControl() {
		return this.#rateControl
	}
	/**
	 * Set rate control mode.
	 * @type {symbol}
	 */
	set rateControl(value) {
		this.#rateControl = value
	}

	/**
	 * Get tag.
	 * @type {string?}
	 */
	get tag() {
		return this.#tag
	}
	/**
	 * Set tag.
	 * @type {string?}
	 */
	set tag(value) {
		if (value && value.length !== 4) {
			throw Error(`This value (${value.toString()}) is invalid length.`)
		}
		this.#tag = value
	}

	static _lowerLimitBitrate() {
		return 0
	}

	static _upperLimitBitrate() {
		return Infinity
	}

	/**
	 * @param   {string|number}            bitrate
	 * @param   {number}                   baseBitrate
	 * @param   {function(number): number} round
	 * @returns {string|number}
	 */
	static _getBitrateSyntax(bitrate, baseBitrate, round = Math.round) {
		/**
		 * @type {string|number}
		 */
		let ret
		if (typeof bitrate === 'string') {
			if (typeof bitrate === 'string' && bitrate.charAt(0) === '*') {
				const multiplier = Number(bitrate.substring(1))
				ret = Math.max(
					this._lowerLimitBitrate(),
					Math.min(
						this._upperLimitBitrate(),
						round(multiplier * baseBitrate)))
			} else {
				ret = removeSIPrefix(bitrate)
			}
		} else {
			ret = bitrate
		}
		return ret
	}

	/**
	 * @param   {symbol|string|null|undefined} value
	 * @param   {symbol}                       defaultValue
	 * @param   {function(symbol): boolean}    isSymbolValid
	 * @param   {function(string): symbol}     toSymbol
	 * @returns {symbol}
	 */
	static _getNormalizedValue(value, defaultValue, isSymbolValid, toSymbol) {
		let ret
		switch (typeof value) {
		case 'string':
			ret = toSymbol(value)
			break
		case 'symbol':
			if (!isSymbolValid(value)) {
				throw Error(`This value (${value.toString()}) is invalid.`)
			}
			ret = value
			break
		case 'undefined':
			ret = defaultValue
			break
		default:
			throw Error(`This value (${value.toString()}) is invalid.`)
		}
		return ret
	}

	/**
	 * @param   {object} params
	 * @param   {string} propNames
	 * @returns {object}
	 */
	static _getSuperParams(params, propNames) {
		const superParams = {}
		if (params != null) {
			for (const propName of propNames) {
				if (Object.prototype.hasOwnProperty.call(params, propName)) {
					superParams[propName] = params[propName]
					delete params[propName]
				}
			}
		}
		return superParams
	}
}

FFmpegOptions.RateControl = Object.freeze({
	ABR: Symbol('ABR'),
	CBR: Symbol('CBR'),
	VBR: Symbol('VBR'),
})

module.exports = FFmpegOptions
