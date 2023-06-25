import { existsSync } from 'fs'

import { Job } from 'bullmq'

// @ts-ignore
import FFmpegEncode from '../../encoders/FFmpegEncode.js'
// @ts-ignore
import FFmpegImageOptions from '../../encoders/options/ffmpeg-image.js'
// @ts-ignore
import getAwaiter from '../../encoders/utils/AwaitSupport.js'
import { ImageEncodeContext } from '../../models/encoders/Context.mjs'
import { EncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { getEncodeFileinfo } from '../../utils/fileSupport.mjs'

/**
 * Encode image.
 * @param job - BullMQ.Job
 * @param ctx - Encode Context
 * @param vnt - Variant
 * @returns   - Promise of progress
 */
export async function encodeImage(job: Job<EncodeData>, ctx: ImageEncodeContext, vnt: Variant): Promise<unknown> {
	const fileinfo = await getEncodeFileinfo(job.data, vnt)
	if (existsSync(fileinfo.output)) {
		return null
	}

	const options = new FFmpegImageOptions(vnt.friendlyCodecId, vnt.encodeOptions)
	const ffmpeg = new FFmpegEncode(options)
		.exec(fileinfo)
		.on('log', (log: string) => job.log(log))
		.on('progress', (p: any) => job.updateProgress(p.frame))
	return await getAwaiter(ffmpeg)
}
