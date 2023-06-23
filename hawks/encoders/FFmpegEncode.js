const { spawn, spawnSync } = require('child_process')
const { createInterface } = require('readline')

const Job = require('./Job')

/**
 * @typedef  {object} FFmpegEncodeProgressData
 * @property {number} frame
 * @property {number} framerate
 * @property {number} q
 * @property {number} size
 * @property {string} time
 * @property {number} bitrate
 * @property {number} speed
 */

class FFmpegEncode extends Job {
	/**
	 * @param {object} options
	 */
	constructor(options) {
		super()
		this.options = options
	}

	/**
	 * @param   {object}                                                 options
	 * @returns {import('child_process').ChildProcessWithoutNullStreams}
	 */
	exec(options) {
		const args = this.options.build(options)

		// Log when dev
		if (process.env.NODE_ENV === 'development') {
			console.log(args.join(' '))
		}

		const ffmpeg = spawn('ffmpeg', args, {
			stdio: [null, 'pipe', 'pipe'],
		})
		createInterface({
			input: ffmpeg.stderr,
			historySize: 0,
		}).on('line', FFmpegEncode.#decodeOutput.bind(null, ffmpeg))
		return ffmpeg
	}

	/**
	 * @param   {object}                                           options
	 * @returns {import('child_process').SpawnSyncReturns<Buffer>}
	 */
	execSync(options) {
		const args = this.options.build(options)

		// Log when dev
		if (process.env.NODE_ENV === 'development') {
			console.log(args.join(' '))
		}

		const ffmpeg = spawnSync('ffmpeg', args, {
			stdio: [null, 'pipe', 'pipe'],
		})
		return ffmpeg
	}

	static LOG = 'log'
	static PROGRESS = 'progress'

	static #re = /^(?:frame= *(?<frame>\d+) fps= *(?<framerate>\d+(?:\.\d+)?) q= *(?<q>-?\d+\.\d+) L?)?size= *(?<size>\d+)kB time= *(?<time>\d+:\d{2}:\d{2}\.\d{2}) bitrate= *(?<bitrate>-?\d+\.\d+)kbits\/s (?:dup= *(?<duplicate>\d+) drop= *(?<drop>\d+) )?speed= *(?<speed>\d+(?:\.\d+)?)x *$/g

	/**
	 * @param {import('child_process').ChildProcessWithoutNullStreams} ffmpeg
	 * @param {string}                                                 str
	 */
	static #decodeOutput(ffmpeg, str) {
		const ret = FFmpegEncode.#re.exec(str)
		if (ret) {
			const progressData = {}
			if (ret.groups.frame) {
				progressData.frame = ret.groups.frame
			}
			if (ret.groups.framerate) {
				progressData.framerate = Number(ret.groups.framerate)
			}
			if (ret.groups.q) {
				progressData.q = Number(ret.groups.q)
			}
			Object.assign(progressData, {
				size: Number(ret.groups.size),
				time: ret.groups.time,
				bitrate: Number(ret.groups.bitrate),
			})
			if (ret.groups.duplicate) {
				progressData.duplicate = Number(ret.groups.duplicate)
			}
			if (ret.groups.drop) {
				progressData.drop = Number(ret.groups.drop)
			}
			progressData.q = Number(ret.groups.speed)
			ffmpeg.emit(FFmpegEncode.PROGRESS, progressData)
		} else {
			ffmpeg.emit(FFmpegEncode.LOG, str)
		}
	}
}

module.exports = FFmpegEncode
