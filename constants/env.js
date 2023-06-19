// [TODO] JavaScript to yaml file
module.exports = {

	// --- Server settings
	// Defines the redis server.
	redisHost: 'localhost',
	redisPort: 6379,
	redisOptions: {
		family: 6,
		username: 'default',
		password: null,
		maxRetriesPerRequest: null,
	},

	// [TODO-impl] Defines to launch the redis server by backend: hawks.
	redisAutorunWhenDevelopment: true,

	// --- User configs
	// Defines the length of screenname
	screennameLength: {
		min: 3,
		max: 128,
	},

	// Defines the length of name
	nameLength: {
		max: 256,
	},

	// --- Post configs
	// Defines the length of title
	titleLength: {
		min: 1,
		max: 64,
	},

	// Defines the length of description
	descriptionLength: {
		max: 1024,
	},

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
	mediaRootPath: '/m',

	mediaForbiddenPath: '/m/*/.*',

	// Defines the public media dir.
	mediaDir: './m',

	// Defines the original video file path.
	mediaOriginalFile: './m/[id]/.org[ext]',

	// Defines the dash video filename.
	mediaDashFilename: 'dash.mpd',

	// Defines the dash initial segment filename.
	mediaDashInitSegmentFilename: '$RepresentationID$-000.m4s',

	// Defines the dash initial segment filename.
	mediaDashMediaSegmentFilename: '$RepresentationID$-$Number%03d$.m4s',

	// Defines the hls video file path.
	mediaHlsFilename: 'hls.m3u8',

	// Defines the image dir.
	mediaImageDir: './m/[id]',

	// Defines the encoded video and audio dir.
	mediaEncodedDir: './m/[id]/.enc',

	// --- Configurable settings
	// Defines the maximum size of ordinal request body.
	requestMaxBodySize: 1024,

	// Defines the upload workdir.
	uploadWorkdir: './.temp',

	// Defines the maximum size of chunk.
	uploadChunkSize: '5M',

	// Defines the maximum size of upload.
	uploadMaxFileSize: '8M',

	// Defines the maximum size of upload.
	uploadMaxSize: '512M',

	// Defines the maximum parallels per upload.
	uploadMaxParallelsPerUpload: 5,

	// Defines the maximum upload job.
	uploadMaxJob: 3,

	// Defines the supported extensions to upload a file
	uploadSupportExtensions: ['mp4', 'm4v', 'webm'],

	// Replace original filename to 'video.[ext]' if true.
	uploadDeleteOriginalFilename: true,

	// Defines the cache terms to the endpoint `GET /api/version`.
	apiVersionCacheTerms: '1h',

	// --- Hawks configs
	hawksConfigsFormat: 'yaml',

	// --- For Development
	uploadMaxFileSizeMultiplierInDev: 15,

	// --- Placeholders: Calc these envs when init.
	// Note: But, you can apply custom value that is larger than 0.
	postFetchingLimit: 0,
	uploadMaxChunks: 0,

}
