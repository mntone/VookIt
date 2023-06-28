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

	colorRange: 'tv' | 'pc'

	colorSpace?: string

	colorTransfer?: string

	colorPrimaries?: string

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
