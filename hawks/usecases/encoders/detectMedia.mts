import { ColorPrimaries, MatrixCoefficients, TransferCharacteristics } from '../../models/Colors.mjs'
import { AllMediaData } from '../../models/encoders/MediaData.mjs'
import { initFramerate, parseFramerate } from '../../models/Framerate.mjs'
import { FFprobeStreamEntriesOptions } from '../../models/trampolines/FFprobeOptions.mjs'
import { FFprobeAudioStreamEntries, FFprobeVideoStreamEntries, FFproveColorSpace } from '../../models/trampolines/FFprobeStreamEntries.mjs'
import { normalizeColorPrimaries, normalizeColorRange, normalizeColorTransfer, normalizeMatrixCoefficients } from '../mappers/ffprobe.mjs'
import { ffproveSync } from '../trampolines/ffprobe.mjs'

const requireVideoInfo: FFprobeStreamEntriesOptions = {
	codecType: true,
	width: true,
	height: true,
	sampleAspectRatio: true,
	displayAspectRatio: true,
	pixFmt: true,
	level: true,
	colorRange: true,
	colorSpace: true,
	colorTransfer: true,
	colorPrimaries: true,
	nbFrames: true,
}

const requireAudioInfo: FFprobeStreamEntriesOptions = {
	codecType: true,
	sampleFmt: true,
	sampleRate: true,
	channels: true,
}

const requireSuperInfo = { ...requireVideoInfo, ...requireAudioInfo }

export function getMediaInfo(filepath: string) {
	const fileInfo = ffproveSync({
		input: filepath,
		showEntries: {
			stream: requireSuperInfo,
			format: {
				duration: true,
				bitRate: true,
			},
		},
	})

	const audioInfo = fileInfo.streams.find(s => s.codecType === 'audio') as FFprobeAudioStreamEntries | undefined
	const videoInfo = fileInfo.streams.find(s => s.codecType === 'video') as FFprobeVideoStreamEntries | undefined
	return {
		audio: audioInfo,
		video: videoInfo,
	}
}

/**
 * HD (BT.709)            (if pixels >= 1280x720)
 * otherwise, SD (BT.601)
 */
const hdPixels = 1280 * 720

function getPixelBit(pixelFormat: string) {
	let bit: number
	switch (pixelFormat) {
	case 'yuv420p10':
	case 'yuv422p10':
	case 'yuv444p10':
		bit = 10
		break
	case 'yuv420p12':
	case 'yuv422p12':
	case 'yuv444p12':
		bit = 12
		break
	case 'yuv420p':
	case 'yuv422p':
	case 'yuv444p':
	default:
		bit = 8
		break
	}
	return bit
}

function getMatrixCoefficients(entries: FFprobeVideoStreamEntries): [MatrixCoefficients, boolean] {
	let suggested: boolean
	let matrixCoefficients: MatrixCoefficients
	if (entries.colorSpace) {
		suggested = false
		matrixCoefficients = normalizeMatrixCoefficients(entries.colorSpace)
	} else {
		suggested = true
		matrixCoefficients = entries.width * entries.height >= hdPixels
			? 'bt709'	// BT.709
			: 'bt470bg'	// BT.601
	}
	return [matrixCoefficients, suggested]
}

function getMatrixCoefficientsFromColorPrimaries(colorPrimaries: ColorPrimaries): MatrixCoefficients {
	let matrixCoefficients: MatrixCoefficients
	switch (colorPrimaries) {
	case 'bt470m':
	case 'bt470bg':
		matrixCoefficients = 'bt470bg'
		break
	case 'smpte170m':
		matrixCoefficients = 'smpte170m'
		break
	case 'smpte240m':
		matrixCoefficients = 'smpte240m'
		break
	case 'bt2020':
		matrixCoefficients = 'bt2020nc'
		break
	case 'bt709':
	case 'displayp3':
	default:
		matrixCoefficients = 'bt709'
		break
	}
	return matrixCoefficients
}

function getColorPrimaries(entries: FFprobeVideoStreamEntries, base: MatrixCoefficients): [ColorPrimaries, boolean] {
	let suggested: boolean
	let colorPrimaries: ColorPrimaries
	if (entries.colorPrimaries) {
		suggested = false
		colorPrimaries = normalizeColorPrimaries(entries.colorPrimaries)
	} else {
		suggested = true
		switch (base) {
		case 'bt470bg':
			colorPrimaries = 'bt470bg'
			break
		case 'smpte170m':
			colorPrimaries = 'smpte170m'
			break
		case 'smpte240m':
			colorPrimaries = 'smpte240m'
			break
		case 'bt2020nc':
		case 'bt2020c':
			colorPrimaries = 'bt2020'
			break
		case 'bt709':
		default:
			colorPrimaries = 'bt709'
			break
		}
	}
	return [colorPrimaries, suggested]
}

function getTransferCharacteristics(entries: FFprobeVideoStreamEntries, base: MatrixCoefficients): TransferCharacteristics {
	let transferCharacteristics: TransferCharacteristics
	if (entries.colorTransfer) {
		transferCharacteristics = normalizeColorTransfer(entries.colorTransfer)
	} else {
		switch (base) {
		case 'bt470bg':
			transferCharacteristics = 'bt470bg'
			break
		case 'smpte170m':
			transferCharacteristics = 'smpte170m'
			break
		case 'smpte240m':
			transferCharacteristics = 'smpte240m'
			break
		case 'bt2020nc':
		case 'bt2020c':
			transferCharacteristics = getPixelBit(entries.pixFmt) === 12 ? 'bt2020-12' : 'bt2020-10'
			break
		case 'bt709':
		default:
			transferCharacteristics = 'bt709'
			break
		}
	}
	return transferCharacteristics
}

export function getAllMediaData(filepath: string) {
	const fileInfo = ffproveSync({
		input: filepath,
		showEntries: {
			stream: {
				codecType: true,
				width: true,
				height: true,
				channels: true,
				rFrameRate: true,
				colorRange: true,
				colorSpace: true,
				colorTransfer: true,
				colorPrimaries: true,
				nbFrames: true,
			},
			format: {
				duration: true,
				bitRate: true,
			},
		},
	})

	const audioInfo = fileInfo.streams.find(s => s.codecType === 'audio') as FFprobeAudioStreamEntries | undefined
	if (!audioInfo) {
		throw Error('This media do not have audio stream.')
	}

	const videoInfo = fileInfo.streams.find(s => s.codecType === 'video') as FFprobeVideoStreamEntries|undefined

	let data: AllMediaData
	if (videoInfo) {
		const [tempMatrixCoefficients, mcSuggested] = getMatrixCoefficients(videoInfo)
		const [colorPrimaries, cpSuggested] = getColorPrimaries(videoInfo, tempMatrixCoefficients)
		const matrixCoefficients = mcSuggested && !cpSuggested
			? getMatrixCoefficientsFromColorPrimaries(colorPrimaries)
			: tempMatrixCoefficients
		data = {
			filepath,
			hasVideo: true,
			width: videoInfo.width,
			height: videoInfo.height,
			colorRange: normalizeColorRange(videoInfo.colorRange),
			matrixCoefficients: matrixCoefficients,
			colorPrimaries: colorPrimaries,
			transferCharacteristics: getTransferCharacteristics(videoInfo, matrixCoefficients),
			duration: Number(fileInfo.format.duration),
			channels: audioInfo.channels,
			framerate: parseFramerate(videoInfo.rFrameRate),
			frames: Number(videoInfo.nbFrames),
		}
	} else {
		data = {
			filepath,
			hasVideo: false,
			width: -1,
			height: -1,
			colorRange: 'tv',
			matrixCoefficients: 'bt709',
			colorPrimaries: 'bt709',
			transferCharacteristics: 'bt709',
			duration: Number(fileInfo.format.duration),
			channels: audioInfo.channels,
			framerate: initFramerate(),
			frames: 0,
		}
	}

	return data
}
