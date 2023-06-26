import { FFprobeFormatEntries } from './FFprobeFormatEntries.mjs'
import { FFprobeAnyStreamEntries, FFprobeStreamEntries } from './FFprobeStreamEntries.mjs'

type Flag<T> = {
	[P in keyof T]: boolean;
}

export type FFprobeFormatEntriesOptions = Partial<Flag<FFprobeFormatEntries>>

export type FFprobeStreamEntriesOptions = Partial<Flag<FFprobeAnyStreamEntries>>

export type FFprobeEntries = {
	streams: FFprobeStreamEntries[]

	format: FFprobeFormatEntries
}

export type FFprobeOptions = {
	input: string

	showFormat?: boolean

	showStreams?: boolean

	showEntries?: {
		format?: FFprobeFormatEntriesOptions

		stream?: FFprobeStreamEntriesOptions
	}
}
