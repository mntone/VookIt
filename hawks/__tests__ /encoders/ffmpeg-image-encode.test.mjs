import { existsSync, rmdirSync } from 'fs'

import { mkdirIfNeeded } from '../../../utils/FileSupport.js'
import FFmpegEncode from '../../encoders/FFmpegEncode.js'
import FFmpegImageOptions from '../../encoders/options/ffmpeg-image.js'
import FFmpegOptions from '../../encoders/options/ffmpeg.js'
import { ffproveSync } from '../../usecases/trampolines/ffprobe.mjs'

class FFmpegTestImageOptions extends FFmpegOptions {
	#width
	#height

	/**
	 * @param {number} width  Width
	 * @param {number} height Height
	 */
	constructor(width, height) {
		super(0, { suppressBitrate: true })
		this.#width = width
		this.#height = height
	}

	_buildOverride(args) {
		delete args.i

		const g = FFmpegTestImageOptions.#gcd(this.#width, this.#height)
		const args2 = {
			f: 'lavfi',
			// i: `color=size=${this.#width}x${this.#height}:rate=1:color=black`,
			i: `smptehdbars=s=${this.#width}x${this.#height}:r=1:d=1`,
			vf: `drawtext=text='${this.#width}x${this.#height}':fontcolor=white:fontsize=192:x=(w-text_w)/2:y=(h-text_h)/2-128,drawtext=text='(${this.#width / g}\\:${this.#height / g})':fontcolor=white:fontsize=192:x=(w-text_w)/2:y=(h-text_h)/2+128`,
			frames: 1,
		}
		Object.assign(args, args2)
	}

	/**
	 * @param   {number} x
	 * @param   {number} y
	 * @returns {number}
	 */
	static #gcd(x, y) {
		if (y === 0) return x
		return FFmpegTestImageOptions.#gcd(y, x % y)
	}
}

const TEST_IMAGE_OUTPUT_PATH = './.dev/.test/'
const TEST_IMAGE_OUTPUT_FILE = TEST_IMAGE_OUTPUT_PATH + '[size].jpg'

const TEST_IMAGE_RESULT_PATH = './.dev/test/'
const TEST_IMAGE_RESULT_FILE = TEST_IMAGE_RESULT_PATH + '[src]_[dst]_[mode].jpg'

/**
 * @param   {number} width  Width
 * @param   {number} height Height
 * @returns {string}        Filepath
 */
function generateTestImage(width, height) {
	const filename = TEST_IMAGE_OUTPUT_FILE.replace('[size]', width + 'x' + height)
	if (existsSync(filename)) {
		return filename
	}

	const options = new FFmpegTestImageOptions(width, height)
	const encoder = new FFmpegEncode(options)
	encoder.execSync({ output: filename })
	return filename
}

/**
 * @param   {number} width  Width
 * @param   {number} height Height
 * @param   {string} target Target
 * @param   {string} mode   Mode
 * @returns {string}        Filepath
 */
function getResultFilename(width, height, target, mode) {
	return TEST_IMAGE_RESULT_FILE
		.replace('[src]', width + 'x' + height)
		.replace('[dst]', target)
		.replace('[mode]', mode)
}

	beforeAll(() => {
		mkdirIfNeeded(TEST_IMAGE_OUTPUT_PATH)
		mkdirIfNeeded(TEST_IMAGE_RESULT_PATH)
	})

	afterAll(() => {
		rmdirSync(TEST_IMAGE_OUTPUT_PATH, { recursive: true })
	})

	test.concurrent.each([
		// input size, target size, mode, expected size
		[[1440, 1080] /* 12    :9 ( 4:3)   */, '400x225', 'crop', [400, 225]],
		[[1620, 1080] /* 13.5  :9 ( 3:2)   */, '400x225', 'crop', [400, 225]],
		[[1920, 1080] /* 16    :9          */, '400x225', 'crop', [400, 225]],
		[[2160, 1080] /* 18    :9          */, '400x225', 'crop', [400, 225]],
		[[2560, 1080] /* 19.5  :9 (iPhone) */, '400x225', 'crop', [400, 225]],
		[[2560, 1080] /* 21.333:9          */, '400x225', 'crop', [400, 225]],
		[[3440, 1440] /* 21.5  :9          */, '400x225', 'crop', [400, 225]],
		[[3840, 1600] /* 21.6  :9 (12:5)   */, '400x225', 'crop', [400, 225]],
		[[3840, 1080] /* 32    :9          */, '400x225', 'crop', [400, 225]],

		[[1440, 1080] /* 12    :9 ( 4:3)   */, '400x225', 'fill', [400, 225]],
		[[1620, 1080] /* 13.5  :9 ( 3:2)   */, '400x225', 'fill', [400, 225]],
		[[1920, 1080] /* 16    :9          */, '400x225', 'fill', [400, 225]],
		[[2160, 1080] /* 18    :9          */, '400x225', 'fill', [400, 225]],
		[[2340, 1080] /* 19.5  :9 (iPhone) */, '400x225', 'fill', [400, 225]],
		[[2560, 1080] /* 21.333:9          */, '400x225', 'fill', [400, 225]],
		[[3440, 1440] /* 21.5  :9          */, '400x225', 'fill', [400, 225]],
		[[3840, 1600] /* 21.6  :9 (12:5)   */, '400x225', 'fill', [400, 225]],
		[[3840, 1080] /* 32    :9          */, '400x225', 'fill', [400, 225]],

		[[1440, 1080] /* 12    :9 ( 4:3)   */, '400x225', 'fit', [300, 225]],
		[[1620, 1080] /* 13.5  :9 ( 3:2)   */, '400x225', 'fit', [338, 225]],
		[[1920, 1080] /* 16    :9          */, '400x225', 'fit', [400, 225]],
		[[2160, 1080] /* 18    :9          */, '400x225', 'fit', [450, 225]],
		[[2340, 1080] /* 19.5  :9 (iPhone) */, '400x225', 'fit', [488, 225]],
		[[2560, 1080] /* 21.333:9          */, '400x225', 'fit', [534, 225]],
		[[3440, 1440] /* 21.5  :9          */, '400x225', 'fit', [538, 225]],
		[[3840, 1600] /* 21.6  :9 (12:5)   */, '400x225', 'fit', [540, 225]],
		[[3840, 1080] /* 32    :9          */, '400x225', 'fit', [800, 225]],
	])('%s to %s (%s)', ([w, h], maxSize, resize, [ew, eh]) => {
		const imagePath = generateTestImage(w, h)
		const outputFilename = getResultFilename(w, h, maxSize, resize)
		const options = new FFmpegImageOptions('jpeg', {
			maxSize,
			resize,
		})
		const encoder = new FFmpegEncode(options)
		const log = encoder.execSync({
			inputs: imagePath,
			output: outputFilename,
		}).stderr.toString()
		console.log(log)

		const fileinfo = ffproveSync({
			input: outputFilename,
			showStreams: true,
		})
		expect(fileinfo.streams[0].width).toBe(ew)
		expect(fileinfo.streams[0].height).toBe(eh)
	})
})
