import { Job } from 'bullmq'

import { EncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'

import { encodeAudio } from './audio.mjs'
import { getSuperContext } from './detectMedia.mjs'
import { encodeImage } from './image.mjs'
import { encodeVideo } from './video.mjs'

export function encodePrefer(job: Job<EncodeData>, filepath: string, vnt: Variant): Promise<unknown> {
	const context = getSuperContext(filepath)

	let task = null
	switch (vnt.type) {
	case 'audio':
		task = encodeAudio(job, context, vnt)
		break
	case 'image':
		task = encodeImage(job, context, vnt)
		break
	case 'video':
		task = encodeVideo(job, context, vnt)
		break
	}
	return task
}
