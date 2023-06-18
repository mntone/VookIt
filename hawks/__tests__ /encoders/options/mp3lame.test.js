const FFmpegAudioOptions = require('../../../encoders/options/ffmpeg-audio')
const Mp3LameOptions = require('../../../encoders/options/mp3lame')

describe('Mp3LameOptions', () => {
	const buildOptions = {
		input: 'INPUT',
		output: 'OUTPUT',
	}

	describe('init', () => {
		test('init', () => {
			const options = new Mp3LameOptions()
			expect(options.codec).toBe(FFmpegAudioOptions.Codec.MP3_LAME)
			expect(options.abr).toBe(false)
		})

		test('init with abr', () => {
			const options = new Mp3LameOptions({ abr: true })
			expect(options.abr).toBe(true)
		})
	})

	describe('build', () => {
		test('!-abr', () => {
			const options = new Mp3LameOptions()
			const args = options.build(buildOptions)
			expect(args).not.toContain('-abr')
		})

		test('-abr', () => {
			const options = new Mp3LameOptions()
			options.abr = true
			const args = options.build(buildOptions)
			expect(args).toContain('-abr')
		})
	})

	describe('property "codec"', () => {
		test('fail to set', () => {
			const options = new Mp3LameOptions()
			expect(() => options.codec = FFmpegAudioOptions.Codec.AAC).toThrow(Error)
		})
	})


	describe('property "abr"', () => {
		test('set true', () => {
			const options = new Mp3LameOptions()
			options.abr = true
			expect(options.abr).toBe(true)
		})

		test('set false', () => {
			const options = new Mp3LameOptions({ abr: true })
			options.abr = false
			expect(options.abr).toBe(false)
		})
	})
})
