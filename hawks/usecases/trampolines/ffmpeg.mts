import { spawn } from 'child_process'
import EventEmitter from 'events'
import { createInterface } from 'readline'

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

export function ffmpeg(args: readonly string[]) {
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
