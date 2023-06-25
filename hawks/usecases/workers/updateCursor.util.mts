import { Job } from 'bullmq'

import { FlowEncodeData } from '../../models/encoders/EncodeData.mjs'

export async function updateCursor(job: Job<FlowEncodeData>, next: number) {
	const data = Object.assign({}, job.data)
	data.cursor = next
	await job.updateData(data)
	return job.data.cursor // Sync job.data automatically
}
