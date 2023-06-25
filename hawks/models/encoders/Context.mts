
type EncodeContext = {
	/**
	 * Original filepath
	 */
	filepath: string
}

type FrameEncodeContext = EncodeContext & {
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
export type VideoEncodeContext = StreamEncodeContext & FrameEncodeContext

export type SuperEncodeContext = AudioEncodeContext & ImageEncodeContext & VideoEncodeContext
