import { AllMediaData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { EncodeData } from '../../models/workers/EncodeData.mjs'

import { encodeAudio } from './audio.mjs'
import { encodeImage } from './image.mjs'
import { encodeVideo } from './video.mjs'

export function encodePrefer(
	ctx: EncodeContext<EncodeData, AllMediaData>,
	vnt: Variant,
) {
	let task = null
	switch (vnt.type) {
	case 'audio':
		task = encodeAudio(ctx, vnt)
		break
	case 'image':
		task = encodeImage(ctx, vnt)
		break
	case 'video':
		task = encodeVideo(ctx, vnt)
		break
	}
	return task
}
