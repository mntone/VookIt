import { Job } from 'bullmq'

import { CodecFlowEncodeData, SpecifiedFlowEncodeData } from '../../models/encoders/EncodeData.mjs'
import { getInputFilepath } from '../../utils/fileSupport.mjs'
import { getSuperContext } from '../encoders/detectMedia.mjs'
import { encodePrefer } from '../encoders/prefer.mjs'
import { encodeVideo } from '../encoders/video.mjs'

import { CodecConfigLoader } from './CodecConfigLoader.mjs'
import { encodeCodec } from './encodeCodec.mjs'

export async function encodeHandler(job: Job<SpecifiedFlowEncodeData>) {
	const filepath = await getInputFilepath(job.data, { assumeDirectory: false })

	switch (job.data.type) {
	case 'codec': {
		const context = await getSuperContext(filepath)
		const codec = CodecConfigLoader.instance.codecBy(job.data.codecId)
		await encodeCodec(
			job as Job<CodecFlowEncodeData>,
			codec,
			variant => encodeVideo(job, context, variant))
		break
	}
	case 'variant': {
		const variant = CodecConfigLoader.instance.variantBy(job.data.variantId)
		await encodePrefer(job, filepath, variant)
		break
	}
	}
}
