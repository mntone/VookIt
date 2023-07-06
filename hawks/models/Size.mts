
export type Size = {
	width: number

	height: number
}

export function parseSize(str: string): Size {
	if (typeof str !== 'string') {
		return {
			width: NaN,
			height: NaN,
		}
	}

	const [width, height] = str.split('x', 2)
	return {
		width: Number(width),
		height: Number(height),
	}
}
