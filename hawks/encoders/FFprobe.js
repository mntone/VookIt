const { spawn, spawnSync } = require('child_process')

const toCommand = require('./utils/command')

/**
 * @param   {object}   options
 * @param   {string}   options.input
 * @param   {boolean?} options.showFormat
 * @param   {boolean?} options.showStreams
 * @returns {string[]}
 */
function buildFFprobeCommand(options) {
	/* eslint-disable camelcase */
	const args = {
		v: 'quiet',
		hide_banner: true,
		i: options.input,
		print_format: 'json',
		show_format: options.showFormat || false,
		show_streams: options.showStreams || false,
	}
	/* eslint-enable camelcase */

	const command = toCommand(args)

	// Log when dev
	if (process.env.NODE_ENV === 'development') {
		console.log(command.join(' '))
	}

	return command
}

/**
 * @param   {object}                                                 options
 * @param   {string}                                                 options.input
 * @param   {boolean?}                                               options.showFormat
 * @param   {boolean?}                                               options.showStreams
 * @returns {import('child_process').ChildProcessWithoutNullStreams}
 */
function exec(options) {
	const command = buildFFprobeCommand(options)
	const ffprobe = spawn('ffprobe', command, {
		stdio: [null, 'pipe', 'pipe'],
	})
	return ffprobe
}

/**
 * @param   {object}          options
 * @param   {string}          options.input
 * @param   {boolean?}        options.showFormat
 * @param   {boolean?}        options.showStreams
 * @returns {Promise<object>}
 */
function execAsJson(options) {
	return new Promise((resolve, reject) => {
		const ffprobe = exec(options)
		ffprobe.stdout.on('data', data => {
			const str = data.toString()
			const json = JSON.parse(str)
			resolve(json)
		})
		ffprobe.on('close', code => reject(code))
	})
}

/**
 * @param   {object}                                           options
 * @param   {string}                                           options.input
 * @param   {boolean?}                                         options.showFormat
 * @param   {boolean?}                                         options.showStreams
 * @returns {import('child_process').SpawnSyncReturns<Buffer>}
 */
function execSync(options) {
	const command = buildFFprobeCommand(options)
	const ffprobe = spawnSync('ffprobe', command, {
		stdio: [null, 'pipe', 'pipe'],
	})
	return ffprobe
}

/**
 * @param   {object}   options
 * @param   {string}   options.input
 * @param   {boolean?} options.showFormat
 * @param   {boolean?} options.showStreams
 * @returns {object}
 */
function execSyncAsJson(options) {
	const ffprobe = execSync(options)
	const str = ffprobe.stdout.toString()
	const json = JSON.parse(str)
	return json
}

module.exports = {
	exec,
	execAsJson,
	execSync,
	execSyncAsJson,
}
