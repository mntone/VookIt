
/**
 * @returns {boolean}
 */
export function preferredReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion:reduce)').matches
}
