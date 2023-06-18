const FFmpegOptions = require('./ffmpeg')

class FFmpegDashOptions extends FFmpegOptions {
	/**
	 * Segment duration
	 * @type {number}
	 */
	#segmentDuration

	/**
	 * Init segment name
	 * @type {string}
	 */
	#initSegmentName

	/**
	 * Media segment name
	 * @type {string}
	 */
	#mediaSegmentName

	/**
	 * Generate HLS file if true
	 * @type {boolean}
	 */
	#hls

	/**
	 * HLS playlist type
	 * @type {symbol}
	 */
	#hlsPlaylistType

	/**
	 * HLS master name
	 * @type {string}
	 */
	#hlsMasterName

	/**
	 * @param {number}   segmentDuration
	 * @param {object}   options
	 * @param {string?}  options.initSegmentName
	 * @param {string?}  options.mediaSegmentName
	 * @param {boolean?} options.hls
	 * @param {symbol?}  options.hlsPlaylistType
	 * @param {string?}  options.hlsMasterName
	 */
	constructor(segmentDuration, options) {
		super(0, { suppressBitrate: true })

		if (typeof segmentDuration !== 'number') {
			throw Error('Segment duration must be "Number".')
		}
		this.#segmentDuration = segmentDuration
		if (options) {
			this.#initSegmentName = options.initSegmentName || null
			this.#mediaSegmentName = options.mediaSegmentName || null
			this.#hls = options.hls || false
			this.#hlsPlaylistType = options.hlsPlaylistType || FFmpegDashOptions.HlsPlaylist.DEFAULT
			this.#hlsMasterName = options.hlsMasterName || null
		} else {
			this.#initSegmentName = null
			this.#mediaSegmentName = null
			this.#hls = false
			this.#hlsPlaylistType = FFmpegDashOptions.HlsPlaylist.DEFAULT
			this.#hlsMasterName = null
		}
	}

	/**
	 * Build args override.
	 * @param {object}          args
	 * @param {object}          options
	 * @param {string[]|string} options.inputs
	 * @param {string}          options.output
	 */
	_buildOverride(args, options) {
		args['codec'] = 'copy'

		// Mapping stream IDs
		const streams = Array.isArray(options.inputs) ? options.inputs.length : 1
		args['map'] = Array.from({ length: streams }, (_, i) => i.toString())

		/* eslint-disable camelcase */
		const args2 = {
			f: 'dash',
			seg_duration: this.#segmentDuration,
			init_seg_name: this.#initSegmentName ?? false,
			media_seg_name: this.#mediaSegmentName ?? false,
			movflags: 'empty_moov+separate_moof+default_base_moof+cmaf',
			adaptation_sets: streams.length > 1
				? 'id=0,streams=v id=1,streams=a'
				: false,
			hls_playlist: this.#hls ? '1' : false,
			hls_playlist_type: this.#hls ? this.#hlsPlaylistType.description : false,
			hls_master_name: this.#hlsMasterName ?? false,
		}
		/* eslint-enable camelcase */
		Object.assign(args, args2)
	}

	/**
	 * Get segment duration.
	 * @type {number}
	 */
	get segmentDuration() {
		return this.#segmentDuration
	}
	/**
	 * Set segment duration.
	 * @type {number}
	 */
	set segmentDuration(value) {
		if (typeof value !== 'number') {
			throw Error('Segment duration must be "Number".')
		}
		if (value < 0) {
			throw Error('Segment duration must be greater than 0.')
		}
		this.#segmentDuration = value
	}

	/**
	 * Get initial segment filename.
	 * @type {string?}
	 */
	get initSegmentName() {
		return this.#initSegmentName
	}
	/**
	 * Set initial segment filename.
	 * @type {string?}
	 */
	set initSegmentName(value) {
		this.#initSegmentName = value
	}

	/**
	 * Get media segment filename.
	 * @type {string?}
	 */
	get mediaSegmentName() {
		return this.#mediaSegmentName
	}
	/**
	 * Set media segment filename.
	 * @type {string?}
	 */
	set mediaSegmentName(value) {
		this.#mediaSegmentName = value
	}

	/**
	 * Get hls enabled.
	 * @type {boolean}
	 */
	get hls() {
		return this.#hls
	}
	/**
	 * Set hls enabled.
	 * @type {boolean}
	 */
	set hls(value) {
		this.#hls = value
	}

	/**
	 * Get hls enabled.
	 * @type {symbol}
	 */
	get hlsPlaylistType() {
		return this.#hlsPlaylistType
	}
	/**
	 * Set hls enabled.
	 * @type {symbol}
	 */
	set hlsPlaylistType(value) {
		this.#hlsPlaylistType = value
	}

	/**
	 * Get hls master filename.
	 * @type {string?}
	 */
	get hlsMasterName() {
		return this.#hlsMasterName
	}
	/**
	 * Set hls master filename.
	 * @type {string?}
	 */
	set hlsMasterName(value) {
		this.#hlsMasterName = value
	}
}

FFmpegDashOptions.HlsPlaylist = Object.freeze({
	DEFAULT: Symbol(0),
	EVENT: Symbol(1),
	VOD: Symbol(2),
})

module.exports = FFmpegDashOptions
