import env from '../../../constants/env.js'
import { Codec } from '../../models/encoders/Codec.mjs'
import { AllMediaData } from '../../models/encoders/MediaData.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'
import { EncodeContext } from '../../models/workers/EncodeContext.mjs'
import { FlowEncodeData } from '../../models/workers/EncodeData.mjs'
import { createCmaf } from '../encoders/deploy.mjs'

import { updateCursor } from './updateCursor.util.mjs'

export async function encodeCodec(
	ctx: EncodeContext<FlowEncodeData, AllMediaData>,
	codec: Readonly<Codec>,
	callback: (variant: Variant) => Promise<unknown>,
) {
	// Use weighted progress for video type
	const isWeighted = codec.type === 'video'

	const maxVariantId = codec.variants.at(-1)!.id

	let cursor = ctx.job.data.cursor
	if (cursor !== maxVariantId) {
		let i
		if (cursor < 0) {
			i = 0
		} else {
			// Restore index from cursor
			i = codec.variants.findIndex(v => v.id === cursor)
		}

		// Create new scope
		ctx.scope(codec.variants.length, isWeighted ? 2.4 /* magic weight */ : 0)

		performance.mark(codec.friendlyId + ':start')
		while (cursor !== maxVariantId) {
			// Start this variant
			ctx.start(i)

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
					await createCmaf(ctx, {
						audioCodecFriendlyIds: codec.variants[0].audioCodecIds,
						videoVariants: codec.variants.slice(0, i + 1),
					})
					performance.mark('st_' + variant.friendlyId + ':end')
				}
			}

			// Done this variant
			await ctx.done()

			// Update index
			++i

			// Update cursor
			cursor = await updateCursor(ctx.job, variant.id)
		}
		performance.mark(codec.friendlyId + ':end')

		// Restore scope
		ctx.restore()
	}
}
