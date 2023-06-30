import { Job, Queue } from 'bullmq'

import { CodecFlowEncodeData, FlowEncodeData } from '../../models/workers/EncodeData.mjs'
import { getInputFilepath } from '../../utils/fileSupport.mjs'
import { encodeAudio } from '../encoders/audio.mjs'
import { encodeImage } from '../encoders/image.mjs'

import { CodecConfigLoader } from './CodecConfigLoader.mjs'
import { encodeAllCodecs } from './encodeAllCodecs.mjs'
import { getSuperContext } from './getSuperContext.mjs'

type Phase = 'pending' | 'image' | 'audio' | 'dispatching' | 'finished'

type MainJobData = FlowEncodeData & {
	phase: Phase
}

const queueCache: Record<string, Queue> = {}

async function updatePhase(job: Job<MainJobData>, next: Phase, resetCursor = false) {
	const data = Object.assign({}, job.data)
	data.phase = next
	if (resetCursor) {
		data.cursor = -1
	}
	await job.updateData(data) // Sync job.data automatically
}

export async function mainHandler(job: Job<MainJobData>) {
	const filepath = await getInputFilepath(job.data, { assumeDirectory: false })
	const context = getSuperContext(job, filepath)
	context.progressRatio = 40

	while (job.data.phase !== 'finished') {
		switch (job.data.phase) {
		case 'pending':
			await updatePhase(job, 'image')
			break

		case 'image': {
			const config = CodecConfigLoader.instance.image
			await encodeAllCodecs(context, config, variant => encodeImage(context, variant))
			await updatePhase(job, 'audio', true)
			break
		}

		case 'audio': {
			const config = CodecConfigLoader.instance.audio
			await encodeAllCodecs(context, config, variant => encodeAudio(context, variant))
			await updatePhase(job, 'dispatching', true)
			break
		}

		case 'dispatching': {
			const videoCodecs = CodecConfigLoader.instance.video.filter(c => c.enabled)
			context.progressRatio = 20 / videoCodecs.length
			for (const codec of videoCodecs) {
				const queueName = codec.queueName
				if (!Object.prototype.hasOwnProperty.call(queueCache, queueName)) {
					queueCache[queueName] = new Queue(queueName)
				}

				// Dispatch encode jobs
				const encodeData: CodecFlowEncodeData = {
					id: job.data.id,
					ext: job.data.ext,
					cursor: -1,
					type: 'codec',
					codecId: codec.id,
				}
				const name = `encode-${job.data.id}:video-${codec.friendlyId}`
				await Job.create(queueCache[queueName], name, encodeData)

				// Update progress
				await context.done()
			}
			await updatePhase(job, 'finished', true)
			break
		}

		default:
			throw Error('Unknown error')
		}
	}
}
