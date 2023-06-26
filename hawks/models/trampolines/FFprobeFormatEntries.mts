
export type FFprobeFormatEntries = {
	filename: string

	nbStreams: number

	nbPrograms: number

	formatName: string

	formatLongName: string

	startTime: string

	duration: string

	size: string

	bitRate: string

	probeScore: number

	tags?: { [key: string]: string }
}
