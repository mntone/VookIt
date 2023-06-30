const { isMac } = require('../../utils/OSSupport')

const FFmpegOptions = require('./ffmpeg')

class FFmpegVideoOptions extends FFmpegOptions {
	static #superPropertyNames = ['tag', 'threads']

	/**
	 * Video codec
	 * @type {symbol}
	 */
	#codec

	/**
	 * Video maximum resolution
	 * @type {string?}
	 */
	#maxSize

	/**
	 * Video maximum framerate
	 * @type {number?}
	 */
	#maxFramerate

	/**
	 * Pixel format
	 * @type {symbol}
	 */
	#pixelFormat

	#params

	/**
	 * @param {symbol|string|null|undefined} codec
	 * @param {number}                       bitrate
	 * @param {object}                       params
	 * @param {string?}                      params.maxSize
	 * @param {number?}                      params.maxFramerate
	 * @param {symbol|string|null|undefined} params.pixelFormat
	 */
	constructor(
		codec,
		bitrate = 1 * 1024 * 1024,
		params = undefined) {
		super(bitrate, FFmpegOptions._getSuperParams(params, FFmpegVideoOptions.#superPropertyNames))

		this.#codec = FFmpegOptions._getNormalizedValue(
			codec,
			FFmpegVideoOptions.Codec.X264,
			FFmpegVideoOptions.isCodecValid,
			FFmpegVideoOptions.parseCodec,
		)

		if (params) {
			this.#maxSize = params.maxSize
			this.#maxFramerate = params.maxFramerate
			this.#pixelFormat = FFmpegOptions._getNormalizedValue(
				params.pixelFormat,
				FFmpegVideoOptions.PixelFormat.DEFAULT,
				FFmpegVideoOptions.isPixelFormatValid,
				FFmpegVideoOptions.parsePixelFormat,
			)
			this.params = params
		} else {
			this.#maxSize = null
			this.#maxFramerate = null
			this.#pixelFormat = FFmpegVideoOptions.PixelFormat.DEFAULT
			this.params = {}
		}
	}

	/**
	 * Build args override.
	 * @param {object} args
	 */
	_buildOverride(args) {
		const args2 = {
			map: '0:v:0',
			vcodec: this.codec.description,
			['tag:v']: this.tag ?? false,
			['b:v']: this.bitrate,
		}

		// [TODO] move to X264Options or X265Options with symbol
		if (this.codec === FFmpegVideoOptions.Codec.X264) {
			args['profile'] = this.params.profile || 'high'
		} else if (this.codec === FFmpegVideoOptions.Codec.X265) {
			args['profile'] = this.params.profile || 'main'
		}

		// [TODO] move to X264Options or X265Options with symbol
		if (this.codec === FFmpegVideoOptions.Codec.X264 || this.codec === FFmpegVideoOptions.Codec.X265) {
			args['preset'] = this.params.preset || 'slow'
		}

		if (typeof this.#maxSize === 'string') {
			const [width, height] = this.#maxSize.split('x').map(Number)
			args['vf'] = `scale=if(lt(${width}/iw\\,${height}/ih)\\,${width}\\,-2):if(lt(${width}/iw\\,${height}/ih)\\,-2\\,${height})`
		}
		if (typeof this.#maxFramerate === 'number') {
			args['fpsmax'] = this.#maxFramerate
		}
		if (true) {
			const keyint = 4
			args['force_key_frames'] = `expr:gte(t,n_forced*${Math.max(1, Math.min(4, keyint))})`
		}

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

	/**
	 * Get video codec.
	 * @type {symbol}
	 */
	get codec() {
		return this.#codec
	}
	/**
	 * Set video codec.
	 * @type {symbol}
	 */
	set codec(value) {
		if (FFmpegVideoOptions.isCodecValid(value)) {
			throw Error(`This value (${value.toString()}) is invalid.`)
		}
		if (!isMac) {
			if (value === FFmpegVideoOptions.Codec.H264_VIDEOTOOLBOX) {
				console.warn('H264_VIDEOTOOLBOX is not supported. This is macOS only.')
				value = FFmpegVideoOptions.Codec.X264
			} else if (value === FFmpegVideoOptions.Codec.HEVC_VIDEOTOOLBOX) {
				console.warn('HEVC_VIDEOTOOLBOX is not supported. This is macOS only.')
				value = FFmpegVideoOptions.Codec.X265
			}
		}
		this.#codec = value
	}

	/**
	 * Get pixel format.
	 * @type {symbol}
	 */
	get pixelFormat() {
		return this.#pixelFormat
	}
	/**
	 * Set pixel format.
	 * @type {symbol}
	 */
	set pixelFormat(value) {
		this.#pixelFormat = value
	}

	/**
	 * Is video codec valid.
	 * @param   {symbol}  codec
	 * @returns {boolean}
	 */
	static isCodecValid(codec) {
		return Object.values(FFmpegVideoOptions.Codec).includes(codec)
	}

	/**
	 * Parse video codec.
	 * @param   {string} str
	 * @returns {symbol}
	 */
	static parseCodec(str) {
		let ret
		switch (str.toLowerCase()) {
		case 'avc':
		case 'avc1':
		case 'h264':
		case 'x264':
		case 'libx264':
			ret = FFmpegVideoOptions.Codec.X264
			break
		case 'h264_vt':
		case 'h264_videotoolbox':
			ret = FFmpegVideoOptions.Codec.H264_VIDEOTOOLBOX
			break
		case 'hevc':
		case 'hvc1':
		case 'hev1':
		case 'h265':
		case 'x265':
		case 'libx265':
			ret = FFmpegVideoOptions.Codec.X265
			break
		case 'hevc_vt':
		case 'hevc_videotoolbox':
			ret = FFmpegVideoOptions.Codec.HEVC_VIDEOTOOLBOX
			break
		case 'vp8':
			ret = FFmpegVideoOptions.Codec.VPX_VP8
			break
		case 'vp9':
			ret = FFmpegVideoOptions.Codec.VPX_VP9
			break
		case 'av1':
			ret = FFmpegVideoOptions.Codec.AOM_AV1
			break
		default:
			throw Error(`This value (${str.toString()}) is invalid.`)
		}
		return ret
	}

	/**
	 * Is pixel format valid.
	 * @param   {symbol}  pixelFormat
	 * @returns {boolean}
	 */
	static isPixelFormatValid(pixelFormat) {
		return Object.values(FFmpegVideoOptions.PixelFormat).includes(pixelFormat)
	}

	/**
	 * Parse pixel format.
	 * @param   {string} str
	 * @returns {symbol}
	 */
	static parsePixelFormat(str) {
		let ret
		switch (str.toLowerCase()) {
		case 'default':
			ret = FFmpegVideoOptions.PixelFormat.DEFAULT
			break
		case 'yuv420p':
			ret = FFmpegVideoOptions.PixelFormat.YUV420P
			break
		case 'yuv420p10le':
			ret = FFmpegVideoOptions.PixelFormat.YUV420P10LE
			break
		default:
			throw Error(`This value (${str.toString()}) is invalid.`)
		}
		return ret
	}
}

FFmpegVideoOptions.Codec = Object.freeze({
	// H.264/AVC
	X264: Symbol('libx264'),
	H264_VIDEOTOOLBOX: Symbol('h264_videotoolbox'), // macOS only

	// H.265/HEVC
	X265: Symbol('libx265'),
	HEVC_VIDEOTOOLBOX: Symbol('hevc_videotoolbox'), // macOS only

	// VP8
	VPX_VP8: Symbol('libvpx'),

	// VP9
	VPX_VP9: Symbol('libvpx-vp9'),

	// AV1
	AOM_AV1: Symbol('libaom-av1'),
})

FFmpegVideoOptions.PixelFormat = Object.freeze({
	DEFAULT: Symbol('default'),
	YUV420P: Symbol('yuv420p'),
	YUV420P10LE: Symbol('yuv420p10le'),
})

module.exports = FFmpegVideoOptions
