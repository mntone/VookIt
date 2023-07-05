import { AllMediaData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { FlowEncodeData } from '../../models/workers/EncodeData.mjs'

import { updateCursor } from './updateCursor.util.mjs'

export async function encodeAllVariants(
	ctx: EncodeContext<FlowEncodeData, AllMediaData>,
	variants: readonly Variant[],
	callback: (variant: Variant) => Promise<unknown>,
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const maxVariantId = variants.at(-1)!.id

	let cursor = ctx.job.data.cursor
	if (cursor !== maxVariantId) {
		let i
		if (cursor < 0) {
			i = 0
		} else {
			// Restore index from cursor
			i = variants.findIndex(v => v.id === cursor)
		}

		// Create new scope
		ctx.scope(variants.length)

		while (cursor !== maxVariantId) {
			// Start this variant
			ctx.start(i)

			const variant = variants[i]
			await callback(variant)

			// Done this variant
			await ctx.done()

			// Update index
			++i

			// Update cursor
			cursor = await updateCursor(ctx.job, variant.id)
		}

		// Restore scope
		ctx.restore()
	}
}
