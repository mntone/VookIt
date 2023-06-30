import { FractionFramerate } from '../Framerate.mjs'

export type MediaData = {
	/**
	 * Original filepath
	 */
	filepath: string
}

type FrameData = MediaData & {
	/**
	 * Is valid video stream.
	 */
	hasVideo: boolean

	/**
	 * Original video width
	 */
	width: number

	/**
	 * Original video height
	 */
	height: number
}

type StreamData = MediaData & {
	/**
	 * Original video duration
	 */
	duration: number
}

export type AudioData = StreamData & {
	/**
	 * Original audio channel
	 */
	channels: number
}

export type ImageData = FrameData

export type VideoData = StreamData & FrameData & {
	/**
	 * Original video framerate
	 */
	framerate: FractionFramerate

	/**
	 * Total frames
	 */
	frames: number
}

export type AllMediaData = AudioData & ImageData & VideoData
