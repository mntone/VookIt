import { spawn } from 'child_process'
import EventEmitter from 'events'
import { createInterface } from 'readline'

import { shell } from './shell.mjs'

const progressRegex = /^(?:frame= *(?<frame>\d+) fps= *(?<framerate>\d+(?:\.\d+)?) q= *(?<q>-?\d+\.\d+) )?L?size= *(?<size>\d+)kB time= *(?<time>\d+:\d{2}:\d{2}\.\d{2}) bitrate= *(?<bitrate>-?\d+\.\d+)kbits\/s (?:dup= *(?<duplicate>\d+) drop= *(?<drop>\d+) )?speed= *(?<speed>\d+(?:\.\d+)?)x *$/g

export type FFmpegProgress = {
	frame?: number

	framerate?: number

	q?: number

	size: number

	time: string

	bitrate: number

	duplicate?: number

	drop?: number

	speed: number
}

function parseFFmpeg(ee: EventEmitter, line: string) {
	ee.emit('log', line)

	const result = progressRegex.exec(line)
	if (result) {
		const progressData: FFmpegProgress = {
			size: result.groups?.size ? Number(result.groups.size) : 0,
			time: result.groups?.time ?? '',
			bitrate: result.groups?.bitrate ? Number(result.groups.bitrate) : 0,
			speed: result.groups?.speed ? Number(result.groups.speed) : 0,
		}
		if (result.groups?.frame) {
			progressData.frame = Number(result.groups.frame)
		}
		if (result.groups?.framerate) {
			progressData.framerate = Number(result.groups.framerate)
		}
		if (result.groups?.q) {
			progressData.q = Number(result.groups.q)
		}
		if (result.groups?.duplicate) {
			progressData.duplicate = Number(result.groups.duplicate)
		}
		if (result.groups?.drop) {
			progressData.drop = Number(result.groups.drop)
		}
		ee.emit('progress', progressData)
	}
}

function __ffmpeg(args: readonly string[]): EventEmitter {
	const ee = new EventEmitter()
	const ffmpeg = spawn('ffmpeg', args, { stdio: [null, 'pipe', 'pipe'] })
		.once('spawn', () => ee.emit('spawn'))
		.once('disconnect', () => ee.emit('disconnect'))
		.once('error', (err: Error) => ee.emit('error', err))
		.once('exit', (code: number | null, signal: NodeJS.Signals | null) => ee.emit('exit', code, signal))
		.once('close', (code: number | null, signal: NodeJS.Signals | null) => ee.emit('close', code, signal))
	createInterface({
		input: ffmpeg.stderr,
		historySize: 0,
	}).on('line', parseFFmpeg.bind(null, ee))
	return ee
}

const cache: {
	version: string | undefined,
	filters: FFmpegFilter[] | undefined,
} = {
	version: undefined,
	filters: undefined,
}
__ffmpeg.__cache__ = cache

/**
 * Get ffmpeg result.
 * @param arg The command arg
 * @returns   The ffmpeg result as string
 */
function ffmpegSync(arg: string): string {
	const data = shell.spawnSync(
		'ffmpeg',
		['-hide_banner', '-nostdin', arg],
	)
	return data
}
Object.defineProperty(__ffmpeg, 'sync', {
	writable: false,
	value: ffmpegSync,
})

/**
 * Get ffmpeg version.
 * @returns The ffmpeg version
 */
function ffmpegVersion(): string {
	if (__ffmpeg.__cache__.version) {
		return __ffmpeg.__cache__.version
	}

	const data = ffmpegSync('-version')
	const result = /^ffmpeg version (?<version>\S+)/.exec(data)
	const version = result?.groups?.version
	if (!version) {
		throw new Error('Fail to parse ffmpeg version.')
	}
	__ffmpeg.__cache__.version = version
	return version
}
Object.defineProperty(__ffmpeg, 'version', {
	get: ffmpegVersion,
})

const filtersRe = /^\s+(?<timelineSupport>[T.])(?<sliceThreading>[S.])(?<commandSupport>[C.])\s+(?<name>\S+)\s+(?<input>A+|V+|N|\|)->(?<output>A+|V+|N|\|)\s+(?<description>.*)$/gm

type FFmpegFilter = {
	timelineSupport: boolean
	sliceThreading: boolean
	commandSupport: boolean
	name: string
	description: string
	input: string
	output: string
}

/**
 * Get ffmpeg supported filters.
 */
function ffmpegFilters() {
	if (__ffmpeg.__cache__.filters) {
		return __ffmpeg.__cache__.filters
	}

	const data = ffmpegSync('-filters')
	if (data.startsWith('No filter name specified.')
		|| data.startsWith('Unknown filter ')) {
		return []
	}

	const filters: FFmpegFilter[] = []
	let result: RegExpExecArray | null
	while ((result = filtersRe.exec(data)) !== null) {
		/* eslint-disable @typescript-eslint/no-non-null-assertion */
		const filter: FFmpegFilter = {
			timelineSupport: result.groups!.timelineSupport === 'T',
			sliceThreading: result.groups!.sliceThreading === 'S',
			commandSupport: result.groups!.commandSupport === 'C',
			name: result.groups!.name,
			description: result.groups!.description,
			input: result.groups!.input,
			output: result.groups!.output,
		}
		/* eslint-enable @typescript-eslint/no-non-null-assertion */
		filters.push(filter)
	}
	__ffmpeg.__cache__.filters = filters
	return filters
}
Object.defineProperty(__ffmpeg, 'filters', {
	get: ffmpegFilters,
})

type FFmpeg = {
	(args: readonly string[]): EventEmitter

	sync(arg: string): string
	version: string
	filters: FFmpegFilter[]
}

export const ffmpeg = __ffmpeg as unknown as FFmpeg

export function getAwaiter(ffmpeg: EventEmitter) {
	return new Promise<number | null>((resolve, reject) => {
		ffmpeg
			.once('disconnect', () => {
				reject()
			})
			.once('error', err => {
				reject(err)
			})
			.once('close', code => {
				if (code !== 0) {
					reject(code)
				} else {
					resolve(code)
				}
			})
	})
}
