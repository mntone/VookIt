import { Job } from 'bullmq'

import { FlowEncodeData } from '../../models/encoders/EncodeData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'

import { updateCursor } from './updateCursor.util.mjs'

export async function encodeAllVariants(
	job: Job<FlowEncodeData>,
	variants: readonly Variant[],
	callback: (variant: Variant) => Promise<unknown>,
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const maxVariantId = variants.at(-1)!.id

	let cursor = job.data.cursor
	if (cursor !== maxVariantId) {
		let i
		if (cursor < 0) {
			i = 0
		} else {
			// Restore index from cursor
			i = variants.findIndex(v => v.id === cursor)
		}

		while (cursor !== maxVariantId) {
			const variant = variants[i]
			await callback(variant)

			// Update index
			++i

			// Update cursor
			cursor = await updateCursor(job, variant.id)
		}
	}
}
