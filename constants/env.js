// [TODO] JavaScript to yaml file
module.exports = {

	// --- Hawks (backend) settings
	// Defines default queue name.
	// [Note] Reserved name: 'main' & 'encode'.
	//        You can use custom queue. Add 'runsOn' for codec or variant to "*.format.yaml".
	hawksQueues: {
		main: {
			concurrency: 1,
			stalledDuration: '5min',
		},
		encode: {
			concurrency: 2,
		},
	},

	// Defines default concurrency (fallback).
	hawksDefaultConcurrency: 1,

	/**
	 * Defines default duration to stall job (fallback).
	 * @type {import("../shared/utils/datetimeTerms.mjs").DateTimeString | number}
	 */
	hawksDefaultStalledDuration: '30min',

	/**
	 * Defines encode delayed duration to create CMAF intermediate stream.
	 * @type {import("../shared/utils/datetimeTerms.mjs").DateTimeString | number}
	 */
	hawksEncodeDelayToSaveIntermediateStream: '1min',

	// Defines the count to keep job log when complete if true.
	hawksKeepJobCountOnComplete: 10,

	// Defines the count to keep job log when complete if true.
	hawksKeepJobCountOnFailure: 100,

	// --- User configs
	// Defines the length of screenname
	screennameMinimumLength: 3,
	screennameMaximumLength: 127,

	// Defines the length of password
	passwordMinimumLength: 10,
	passwordMaximumLength: 127,

	// Defines the length of name
	nameLength: {
		max: 255,
	},

	// --- Post configs
	// Defines the length of title
	titleLength: {
		min: 1,
		max: 63,
	},

	// Defines the maximum length of description
	descriptionMaximumLength: 1023,

	// --- VideoCard configs
	// Defines the thumbnail codec list in VideoCard component.
	videoCardThumbnailWidth: 400,
	videoCardThumbnailHeight: 225,
	videoCardThumbnailVariantsByMimes: {
		'image/avif': {
			'1x': 't@1.avif',
			'2x': 't@2.avif',
			'3x': 't@3.avif',
		},
		'image/webp': {
			'1x': 't@1.webp',
			'2x': 't@2.webp',
		},
		'default': {
			'default': 't@1.jpg',
			'2x': 't@2.jpg',
		},
	},

	// --- Top page configs
	topMaxCount: 25,

	// --- Media configs
	// [Backport for /clogs/usecase/uploads/utils.js]
	// Defines the public media dir.
	mediaOutputDir: './.media',

	// Defines the original filename.
	mediaOriginalFilename: '.org[ext]',

	// Defines the private dirname.
	mediaPrivateDirname: '.enc',

	// Defines the dash video filename.
	mediaDashFilename: 'dash.mpd',

	// Defines the dash initial segment filename.
	// [Note] require "ceil(log10(ceil((maximumDuration / keyint) + 1)))" digits
	mediaDashInitSegmentFilename: '$RepresentationID$-00.m4s',

	// Defines the dash initial segment filename.
	// [Note] require "ceil(log10(ceil((maximumDuration / keyint) + 1)))" digits
	mediaDashMediaSegmentFilename: '$RepresentationID$-$Number%02d$.m4s',

	// Defines the hls video file path.
	mediaHlsFilename: 'hls.m3u8',

	// --- Configurable settings
	// Defines the upload workdir.
	uploadWorkdir: './.temp',

	/**
	 * Defines the maximum size of chunk upload.
	 * @type {string | number}
	 */
	uploadMaxChunkSize: '8M',

	/**
	 * Defines the maximum total size of chunk upload.
	 * @type {string | number}
	 */
	uploadMaxTotalSize: '256M',

	/**
	 * Defines the maximum size of upload.
	 * @type {string | number}
	 */
	uploadMaxFileSize: '8M',

	// Defines the maximum retry count for chunk upload.
	uploadMaxRetries: 3,

	// Defines the maximum connections per chunk upload.
	uploadMaxConnections: 3,

	// Defines the maximum upload job.
	uploadMaxJob: 3,

	// Defines the supported extensions to upload a file
	uploadSupportExtensions: ['.mp4', '.m4v', '.webm'],

	// Defines the supported mime type to upload a file
	uploadSupportMimeTypes: ['video/mp4', 'video/webm'],

	// Replace original filename to 'video.[ext]' if true.
	uploadDeleteOriginalFilename: true,

	// Defines the cache terms to the endpoint `GET /api/version`.
	apiVersionCacheTerms: '1h',

	// --- Placeholders: Calc these envs when init.
	// Note: But, you can apply custom value that is larger than 0.
	postFetchingLimit: 0,
	uploadMaxChunks: 0,

}
