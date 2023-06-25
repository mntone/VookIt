import { Job, Queue } from 'bullmq'

import { CodecFlowEncodeData, FlowEncodeData } from '../../models/encoders/EncodeData.mjs'
import { getInputFilepath } from '../../utils/fileSupport.mjs'
import { encodeAudio } from '../encoders/audio.mjs'
import { getSuperContext } from '../encoders/detectMedia.mjs'
import { encodeImage } from '../encoders/image.mjs'

import { CodecConfigLoader } from './CodecConfigLoader.mjs'
import { encodeAllCodecs } from './encodeAllCodecs.mjs'

type Phase = 'pending' | 'image' | 'audio' | 'dispatching' | 'finished'

type MainJobData = FlowEncodeData & {
	phase: Phase
}

const queueCache: { [key: string]: Queue } = {}

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
	const context = await getSuperContext(filepath)

	while (job.data.phase !== 'finished') {
		switch (job.data.phase) {
		case 'pending':
			await updatePhase(job, 'image')
			break

		case 'image': {
			const config = CodecConfigLoader.instance.image
			await encodeAllCodecs(job, config, variant => encodeImage(job, context, variant))
			await updatePhase(job, 'audio', true)
			break
		}

		case 'audio': {
			const config = CodecConfigLoader.instance.audio
			await encodeAllCodecs(job, config, variant => encodeAudio(job, context, variant))
			await updatePhase(job, 'dispatching', true)
			break
		}

		case 'dispatching': {
			const videoCodecs = CodecConfigLoader.instance.video.filter(c => c.enabled)
			for (const codec of videoCodecs) {
				const queueName = codec.queueName
				if (!queueCache[queueName]) {
					queueCache[queueName] = new Queue(queueName)
				}

				const encodeData: CodecFlowEncodeData = {
					id: job.data.id,
					ext: job.data.ext,
					cursor: -1,
					type: 'codec',
					codecId: codec.id,
				}
				await Job.create(queueCache[queueName], 'encode:auto:video', encodeData)
			}
			await updatePhase(job, 'finished', true)
			break
		}

		default:
			throw Error('Unknown error')
		}
	}
}
