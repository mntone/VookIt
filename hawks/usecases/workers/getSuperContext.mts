import { Job } from 'bullmq'

import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'
import { getAllMediaData } from '../encoders/detectMedia.mjs'

export function getSuperContext<JobData extends EncodeData>(job: Job<JobData>, filepath: string) {
	const data = getAllMediaData(filepath)
	const context = new EncodeContext(job, data, filepath)
	return context
}
