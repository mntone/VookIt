import {
	ColorPrimaries,
	ColorRange,
	MatrixCoefficients,
	TransferCharacteristics,
} from '../Colors.mjs'
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

	/**
	 * Original color range
	 */
	colorRange: ColorRange

	/**
	 * Original matrix coefficients
	 */
	matrixCoefficients: MatrixCoefficients

	/**
	 * Original color primaries
	 */
	colorPrimaries: ColorPrimaries

	/**
	 * Original transfer characteristics
	 */
	transferCharacteristics: TransferCharacteristics
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
