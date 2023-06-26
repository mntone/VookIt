
export function initFramerate(numerator = 0, denominator = 1): FractionFramerate {
	return {
		numerator,
		denominator,
	}
}

export function parseFramerate(str: string): FractionFramerate {
	const [numerator, denominator] = str.split('/', 2)
	return {
		numerator: Number(numerator),
		denominator: Number(denominator),
	}
}

export type FractionFramerate = {
	numerator: number,

	denominator: number
}

export type Framerate = FractionFramerate | string | number
