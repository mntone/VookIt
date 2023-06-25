import { Job } from 'bullmq'

import { Codec } from '../../models/encoders/Codec.mjs'
import { FlowEncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'

import { updateCursor } from './updateCursor.util.mjs'

export async function encodeAllCodecs(
	job: Job<FlowEncodeData>,
	media: Readonly<Codec>[],
	callback: (variant: Variant) => Promise<unknown>,
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const maxVariantId = media.at(-1)!.variants.at(-1)!.id

	let cursor = job.data.cursor
	if (cursor !== maxVariantId) {
		let i, j
		if (cursor < 0) {
			i = 0
			j = 0
		} else {
			// Restore index from cursor
			const t = media.map(c => c.variants.findIndex(v => v.id === cursor))
			i = t.findIndex(i => i !== -1)
			j = t[i] + 1
			if (j === media[i].variants.length) {
				i += 1
				j = 0
			}
		}

		while (cursor !== maxVariantId) {
			const variant = media[i].variants[j]
			await callback(variant)

			// Update index
			if (++j === media[i].variants.length) {
				i += 1
				j = 0
			}

			// Update cursor
			cursor = await updateCursor(job, variant.id)
		}
	}
}
