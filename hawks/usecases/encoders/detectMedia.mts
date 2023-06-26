// @ts-ignore
import { SuperEncodeContext } from '../../models/encoders/Context.mjs'
import { initFramerate, parseFramerate } from '../../models/Framerate.mjs'
import { FFprobeStreamEntriesOptions } from '../../models/trampolines/FFprobeOptions.mjs'
import { FFprobeAudioStreamEntries, FFprobeVideoStreamEntries } from '../../models/trampolines/FFprobeStreamEntries.mjs'
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

export function getSuperContext(filepath: string) {
	const fileInfo = ffproveSync({
		input: filepath,
		showEntries: {
			stream: {
				codecType: true,
				width: true,
				height: true,
				channels: true,
				rFrameRate: true,
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

	let context: SuperEncodeContext
	if (videoInfo) {
		context = {
			filepath,
			hasVideo: true,
			width: videoInfo.width,
			height: videoInfo.height,
			duration: Number(fileInfo.format.duration),
			channels: audioInfo.channels,
			framerate: parseFramerate(videoInfo.rFrameRate),
		}
	} else {
		context = {
			filepath,
			hasVideo: false,
			width: -1,
			height: -1,
			duration: Number(fileInfo.format.duration),
			channels: audioInfo.channels,
			framerate: initFramerate(),
		}
	}

	return context
}
