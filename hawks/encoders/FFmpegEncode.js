const { spawn, spawnSync } = require('child_process')

const Job = require('./Job')

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
}

module.exports = FFmpegEncode
