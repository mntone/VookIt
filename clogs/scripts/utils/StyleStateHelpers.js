
/**
 * @returns {boolean}
 */
export const preferredReducedMotion = () => {
	return window.matchMedia('(prefers-reduced-motion:reduce)').matches
}
