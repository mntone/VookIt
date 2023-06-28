const FFmpegDashOptions = require('../../../encoders/options/ffmpeg-dash')

describe('FFmpegDashOptions', () => {
	const DEFAULT_SEGMENT_DURATION = 4

	describe('init', () => {
		test('init', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			expect(options.segmentDuration).toBe(4)
			expect(options.initSegmentName).toBe(null)
			expect(options.mediaSegmentName).toBe(null)
			expect(options.hls).toBe(false)
			expect(options.hlsPlaylistType).toBe(FFmpegDashOptions.HlsPlaylist.DEFAULT)
			expect(options.hlsMasterName).toBe(null)
		})

		test('init with string', () => {
			expect(() => new FFmpegDashOptions('2')).toThrow(Error)
		})
	})

	describe('property "segmentDuration"', () => {
		test('set 2', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			options.segmentDuration = 2
			expect(options.segmentDuration).toBe(2)
		})

		test('set -2', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			expect(() => options.segmentDuration = -2).toThrow(Error)
		})

		test('set string', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			expect(() => options.segmentDuration = '2').toThrow(Error)
		})
	})

	describe('property "initSegmentName"', () => {
		test('set "$RepresentationID$-000.m4s"', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			options.initSegmentName = '$RepresentationID$-000.m4s'
			expect(options.initSegmentName).toBe('$RepresentationID$-000.m4s')
		})
	})

	describe('property "mediaSegmentName"', () => {
		test('set "$RepresentationID$-$Number%03d$.m4s"', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			options.mediaSegmentName = '$RepresentationID$-$Number%03d$.m4s'
			expect(options.mediaSegmentName).toBe('$RepresentationID$-$Number%03d$.m4s')
		})
	})

	describe('property "hls"', () => {
		test('set true', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			options.hls = true
			expect(options.hls).toBe(true)
		})

		test('set false', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION, { hls: true })
			options.hls = false
			expect(options.hls).toBe(false)
		})
	})

	describe('property "hlsPlaylistType"', () => {
		test.each([
			[FFmpegDashOptions.HlsPlaylist.DEFAULT],
			[FFmpegDashOptions.HlsPlaylist.EVENT],
			[FFmpegDashOptions.HlsPlaylist.VOD],
		])('set hlsPlaylistType: %s', expected => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			if (options.hlsPlaylistType === FFmpegDashOptions.HlsPlaylist.DEFAULT) {
				options.hlsPlaylistType = FFmpegDashOptions.HlsPlaylist.EVENT
			}
			options.hlsPlaylistType = expected
			expect(options.hlsPlaylistType).toBe(expected)
		})
	})

	describe('property "hlsMasterName"', () => {
		test('set "index.m3u8"', () => {
			const options = new FFmpegDashOptions(DEFAULT_SEGMENT_DURATION)
			options.hlsMasterName = 'index.m3u8'
			expect(options.hlsMasterName).toBe('index.m3u8')
		})
	})
})
