// @ts-ignore
import { execAsJson as execFFproveAsJson } from '../../encoders/FFprobe.js'
import { SuperEncodeContext } from '../../models/encoders/Context.mjs'

export async function getSuperContext(filepath: string) {
	const fileInfo = await execFFproveAsJson({
		input: filepath,
		showFormat: true,
		showStreams: true,
	})
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const audioInfo = fileInfo.streams.find((s: any) => s.codec_type === 'audio')
	const videoInfo = fileInfo.streams.find((s: any) => s.codec_type === 'video')
	/* eslint-enable @typescript-eslint/no-explicit-any */

	const context: SuperEncodeContext = {
		filepath,
		width: videoInfo.width,
		height: videoInfo.height,
		duration: Number(fileInfo.format.duration),
		channels: audioInfo.channels,
	}
	return context
}
