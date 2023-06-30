import { Job } from 'bullmq'

import { CodecFlowEncodeData, SpecifiedFlowEncodeData, VariantFlowEncodeData } from '../../models/workers/EncodeData.mjs'
import { getInputFilepathSync } from '../../utils/fileSupport.mjs'
import { encodePrefer } from '../encoders/prefer.mjs'

import { CodecConfigLoader } from './CodecConfigLoader.mjs'
import { encodeCodec } from './encodeCodec.mjs'
import { getSuperContext } from './getSuperContext.mjs'

export async function encodeHandler(job: Job<SpecifiedFlowEncodeData>) {
	const filepath = getInputFilepathSync(job.data)

	switch (job.data.type) {
	case 'codec': {
		const context = getSuperContext(job as Job<CodecFlowEncodeData>, filepath)
		const codec = CodecConfigLoader.instance.codecBy(job.data.codecId)
		await encodeCodec(
			context,
			codec,
			variant => encodePrefer(context, variant))
		break
	}
	case 'variant': {
		const context = getSuperContext(job as Job<VariantFlowEncodeData>, filepath)
		const variant = CodecConfigLoader.instance.variantBy(job.data.variantId)
		await encodePrefer(context, variant)
		await context.done()
		break
	}
	}
}
