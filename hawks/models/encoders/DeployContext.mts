import { Variant } from './Variant.mjs'

export type DeployContext = {
	/**
	 * Audio Variant IDs
	 */
	audioCodecFriendlyIds: string[]

	/**
	 * Video Variants
	 */
	videoVariants: Variant[]
}
