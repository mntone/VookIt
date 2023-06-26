import { spawnSync } from 'child_process'

import snakeCase from 'lodash.snakecase'

// @ts-ignore
import toCommand from '../../encoders/utils/command.js'
import { FFprobeEntries, FFprobeOptions } from '../../models/trampolines/FFprobeOptions.mjs'

import { camelCasify } from './camelCasify.util.mjs'

function toFlags(flags: { [key: string]: boolean }) {
	return Object.entries(flags).filter(f => f[1]).map(f => snakeCase(f[0]))
}

function buildFFprobeCommand(options: FFprobeOptions) {
	/* eslint-disable camelcase */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const args: any = {
		v: 'quiet',
		i: options.input,
		print_format: 'json=c=1',
		show_format: options.showFormat ?? options.showEntries?.format != null,
		show_streams: options.showStreams ?? options.showEntries?.stream != null,
	}
	if (options.showEntries) {
		if (options.showStreams !== false && options.showEntries.stream) {
			const flags = toFlags(options.showEntries.stream)
			if (flags.length !== 0) {
				args.show_entries = 'stream=' + flags.join(',')
			}
		}
		if (options.showFormat !== false && options.showEntries.format) {
			const flags = toFlags(options.showEntries.format)
			if (flags.length !== 0) {
				args.show_entries = args.show_entries
					? args.show_entries + ':format=' + flags.join(',')
					: 'format=' + flags.join(',')
			}
		}
	}
	/* eslint-enable camelcase */

	const command = toCommand(args)

	// Log when dev
	if (process.env.NODE_ENV === 'development') {
		console.log(command.join(' '))
	}

	return command
}

export function ffproveSync(options: FFprobeOptions) {
	const command = buildFFprobeCommand(options)
	const ffprobe = spawnSync('ffprobe', command, {
		stdio: [null, 'pipe', null],
	})
	const str = ffprobe.stdout.toString()
	const json = JSON.parse(str)
	return camelCasify(json) as FFprobeEntries
}
