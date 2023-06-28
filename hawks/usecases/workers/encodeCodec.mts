import { Job } from 'bullmq'

// @ts-expect-error
import env from '../../../constants/env.js'
import { Codec } from '../../models/encoders/Codec.mjs'
import { FlowEncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { createCmaf } from '../encoders/deploy.mjs'

import { updateCursor } from './updateCursor.util.mjs'

export async function encodeCodec(
	job: Job<FlowEncodeData>,
	codec: Readonly<Codec>,
	callback: (variant: Variant) => Promise<unknown>,
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const maxVariantId = codec.variants.at(-1)!.id

	let cursor = job.data.cursor
	if (cursor !== maxVariantId) {
		let i
		if (cursor < 0) {
			i = 0
		} else {
			// Restore index from cursor
			i = codec.variants.findIndex(v => v.id === cursor)
		}

		performance.mark(codec.friendlyId + ':start')
		while (cursor !== maxVariantId) {
			const variant = codec.variants[i]

			performance.mark(variant.friendlyId + ':start')
			await callback(variant)
			performance.mark(variant.friendlyId + ':end')

			if (codec.type === 'video') {
				const nextCursor = variant.id
				const entry = performance.measure(
					variant.friendlyId,
					variant.friendlyId + ':start',
					variant.friendlyId + ':end',
				)
				if (nextCursor === maxVariantId || nextCursor !== maxVariantId && entry.duration > env.hawksEncodeDelayToSaveIntermediateStream) {
					performance.mark('st_' + variant.friendlyId + ':start')
					await createCmaf(job, {
						audioCodecFriendlyIds: codec.variants[0].audioCodecIds,
						videoVariants: codec.variants.slice(0, i + 1),
					})
					performance.mark('st_' + variant.friendlyId + ':end')
				}
			}

			// Update index
			++i

			// Update cursor
			cursor = await updateCursor(job, variant.id)
		}
		performance.mark(codec.friendlyId + ':end')
	}
}
