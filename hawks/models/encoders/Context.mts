import { FractionFramerate } from '../Framerate.mjs'

type EncodeContext = {
	/**
	 * Original filepath
	 */
	filepath: string
}

type FrameEncodeContext = EncodeContext & {
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

type StreamEncodeContext = EncodeContext & {
	/**
	 * Original video duration
	 */
	duration: number
}

export type AudioEncodeContext = StreamEncodeContext & {
	/**
	 * Original audio channel
	 */
	channels: number
}

export type ImageEncodeContext = FrameEncodeContext
export type VideoEncodeContext = StreamEncodeContext & FrameEncodeContext & {
	/**
	 * Original video framerate
	 */
	framerate: FractionFramerate
}

export type SuperEncodeContext = AudioEncodeContext & ImageEncodeContext & VideoEncodeContext
