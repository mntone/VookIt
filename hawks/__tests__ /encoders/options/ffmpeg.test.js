const FFmpegOptions = require('../../../encoders/options/ffmpeg')

describe('FFmpegOptions', () => {
	const DEFAULT_PARAMS = ['256k']

	describe('init', () => {
		test('init', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			expect(options.bitrate).toBe(256 * 1024)
			expect(options.minBitrate).toBe('*0.9375')
			expect(options.maxBitrate).toBe('*1.0625')
			expect(options.suppressBitrate).toBe(false)
		})

		test('init with zero', () => {
			expect(() => new FFmpegOptions(0)).toThrow(Error)
		})

		test('init with negative', () => {
			expect(() => new FFmpegOptions(-2)).toThrow(Error)
		})

		test('init with suppressBitrate', () => {
			const options = new FFmpegOptions(0, { suppressBitrate: true })
			expect(options.suppressBitrate).toBe(true)
		})

		test('init with tag "hvc1"', () => {
			const options = new FFmpegOptions(DEFAULT_PARAMS[0], { tag: 'hvc1' })
			expect(options.tag).toBe('hvc1')
		})
	})

	describe('property "bitrate"', () => {
		test('set number', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			options.bitrate = 4
			expect(options.bitrate).toBe(4)
		})

		test('set string', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			options.bitrate = '512k'
			expect(options.bitrate).toBe(512 * 1024)
		})

		test('set zero', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			expect(() => options.bitrate = 0).toThrow(Error)
		})

		test('set negative', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			expect(() => options.bitrate = -5).toThrow(Error)
		})
	})

	describe('property "rateControl"', () => {
		test.each([
			[FFmpegOptions.RateControl.ABR],
			[FFmpegOptions.RateControl.CBR],
			[FFmpegOptions.RateControl.VBR],
		])('set rateControl: %s', expected => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			if (options.rateControl === FFmpegOptions.RateControl.CBR) {
				options.rateControl = FFmpegOptions.RateControl.ABR
			}
			options.rateControl = expected
			expect(options.rateControl).toBe(expected)
		})
	})

	describe('property "tag"', () => {
		test('set  "hvc1"', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			options.tag = 'hvc1'
			expect(options.tag).toBe('hvc1')
		})

		test('set "avc"', () => {
			const options = new FFmpegOptions(...DEFAULT_PARAMS)
			expect(() => options.tag = 'avc').toThrow(Error)
		})
	})
})
