import { FFprobeDispositionEntries } from './FFprobeDispositionEntries.mjs'

export type FFprobeStreamEntries = {
	index: number

	codecName: string

	codecLongName: string

	profile: string

	codecType: string

	codecTagString: string

	codecTag: string

	id: string

	rFrameRate: string

	avgFrameRate: string

	timeBase: string

	startPts: number

	startTime: string

	durationTs: number

	duration: string

	bitRate: string

	nbFrames: string

	extradataSize: number

	disposition: FFprobeDispositionEntries

	tags?: Record<string, string>
}

export type FFproveColorRange = 'tv' | 'mpeg' | 'pc' | 'jpeg'

export type FFproveColorSpace = 'bt709' | 'fcc' | 'bt470bg' | 'smpte170m' | 'smpte240m' | 'ycocg' | 'rgb' | 'gbr' | 'bt2020nc' | 'bt2020c' | 'smpte2085'

export type FFproveColorTransfer = 'bt709' | 'bt470m' | 'gamma22' | 'bt470bg' | 'gamma28' | 'smpte170m' | 'smpte240m' | 'linear' | 'log' | 'log100' | 'log_sqrt' | 'log316' | 'iec61966-2-1' | 'srgb' | 'iec61966-2-4' | 'xvycc' | 'bt2020-10' | 'bt2020-12' | 'bt1361' | 'bt1361e' | 'smpte2084' | 'smpte428' | 'smpte428_1' | 'arib-std-b67'

export type FFproveColorPrimaries = 'bt709' | 'bt470m' | 'bt470bg' | 'smpte170m' | 'smpte240m' | 'smpte428' | 'film' | 'smpte431' | 'smpte432' | 'bt2020' | 'jedec-p22' | 'ebu3213'

export type FFprobeVideoStreamEntries = FFprobeStreamEntries & {
	codecType: 'video'

	width: number

	height: number

	codedWidth: number

	codecHeight: number

	closedCaptions: number

	flimGrain: number

	hasBFrames: number

	sampleAspectRatio: string

	displayAspectRatio: string

	pixFmt: string

	level: number

	colorRange: FFproveColorRange

	colorSpace?: FFproveColorSpace

	colorTransfer?: FFproveColorTransfer

	colorPrimaries?: FFproveColorPrimaries

	chromaLocation: 'left' | 'center' | 'topleft' | 'top' | 'bottomleft' | 'bottom'

	fieldOrder: 'unknown' | 'progressive' | 'tff' | 'bff'

	refs: number

	isAvc: string // (boolean)

	nalLengthSize: string

	bitsPerRawSample: string
}

export type FFprobeAudioStreamEntries = FFprobeStreamEntries & {
	codecType: 'audio'

	sampleFmt: string

	sampleRate: string

	channels: number

	channelLayout: string

	bitsPerSample: number
}

export type FFprobeAnyStreamEntries = { codecType: string } & Omit<FFprobeVideoStreamEntries, 'codecType'> & Omit<FFprobeAudioStreamEntries, 'codecType'>
