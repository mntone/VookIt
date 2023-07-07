
import { Codec } from '../../models/encoders/Codec.mjs'
import { AllMediaData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { FlowEncodeData } from '../../models/workers/EncodeData.mjs'

import { updateCursor } from './updateCursor.util.mjs'

export async function encodeAllCodecs(
	ctx: EncodeContext<FlowEncodeData, AllMediaData>,
	media: Readonly<Codec>[],
	callback: (variant: Variant) => Promise<unknown>,
) {
	const maxVariantId = media.at(-1)!.variants.at(-1)!.id

	let cursor = ctx.job.data.cursor
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

		// Create new scope
		const step = media.reduce((p, m) => p + m.variants.length, 0)
		ctx.scope(step)

		while (cursor !== maxVariantId) {
			// Start this variant
			ctx.start()

			const variant = media[i].variants[j]
			await callback(variant)

			// Done this variant
			await ctx.done()

			// Update index
			if (++j === media[i].variants.length) {
				i += 1
				j = 0
			}

			// Update cursor
			cursor = await updateCursor(ctx.job, variant.id)
		}

		// Restore scope
		ctx.restore()
	}
}
