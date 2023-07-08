import { Filter, FilterProperty } from './base.mjs'

export class UnsharpFilter extends Filter {
	#lumaX = 5
	#lumaY = 5
	#lumaAmount = 1
	#chromaX = 5
	#chromaY = 5
	#chromaAmount = 0
	#alphaX = 5
	#alphaY = 5
	#alphaAmount = 0

	constructor(str?: string) {
		super('video')

		if (typeof str === 'string') {
			if (str.startsWith('unsharp=')) {
				str = str.substring(8)
			}
			this._parseFromDefines(str, UnsharpFilter.properties)
		}
	}

	#checkMatrix(value: number) {
		if (!Number.isInteger(value) || value % 2 === 0) {
			throw new Error('The value is odd number.')
		}
		if (value < 3) {
			throw new Error('The value is greater than 3.')
		}
		if (value > 23) {
			throw new Error('The value is less than 23.')
		}
	}

	#checkAmount(value: number) {
		if (value < -2) {
			throw new Error('The value is greater than -2.')
		}
		if (value > 5) {
			throw new Error('The value is less than 5.')
		}
	}

	lumaX(value: number) {
		this.#checkMatrix(value)
		this.#lumaX = value
		return this
	}

	lumaY(value: number) {
		this.#checkMatrix(value)
		this.#lumaY = value
		return this
	}

	lumaAmount(value: number) {
		this.#checkAmount(value)
		this.#lumaAmount = value
		return this
	}

	chromaX(value: number) {
		this.#checkMatrix(value)
		this.#chromaX = value
		return this
	}

	chromaY(value: number) {
		this.#checkMatrix(value)
		this.#chromaY = value
		return this
	}

	chromaAmount(value: number) {
		this.#checkAmount(value)
		this.#chromaAmount = value
		return this
	}

	alphaX(value: number) {
		this.#checkMatrix(value)
		this.#alphaX = value
		return this
	}

	alphaY(value: number) {
		this.#checkMatrix(value)
		this.#alphaY = value
		return this
	}

	alphaAmount(value: number) {
		this.#checkAmount(value)
		this.#alphaAmount = value
		return this
	}

	override build(): string {
		return this._buildFromDefines(
			UnsharpFilter.filterName,
			UnsharpFilter.properties,
		)
	}

	// Getters for testing.
	getLumaX(): number {
		return this.#lumaX
	}
	getLumaY(): number {
		return this.#lumaY
	}
	getLumaAmount(): number {
		return this.#lumaAmount
	}
	getChromaX(): number {
		return this.#chromaX
	}
	getChromaY(): number {
		return this.#chromaY
	}
	getChromaAmount(): number {
		return this.#chromaAmount
	}
	getAlphaX(): number {
		return this.#alphaX
	}
	getAlphaY(): number {
		return this.#alphaY
	}
	getAlphaAmount(): number {
		return this.#alphaAmount
	}

	static override readonly filterName = 'unsharp'

	static override readonly properties: FilterProperty[] = [
		Filter._nprop(0, ['lx', 'luma_msize_x'], 5, 3, 23, t => (t as UnsharpFilter).#lumaX, (t, v) => (t as UnsharpFilter).#lumaX = v),
		Filter._nprop(1, ['ly', 'luma_msize_y'], 5, 3, 23, t => (t as UnsharpFilter).#lumaY, (t, v) => (t as UnsharpFilter).#lumaY = v),
		Filter._nprop(2, ['la', 'luma_amount'], 1, -2, 5, t => (t as UnsharpFilter).#lumaAmount, (t, v) => (t as UnsharpFilter).#lumaAmount = v),
		Filter._nprop(3, ['cx', 'chroma_msize_x'], 5, 3, 23, t => (t as UnsharpFilter).#chromaX, (t, v) => (t as UnsharpFilter).#chromaX = v),
		Filter._nprop(4, ['cy', 'chroma_msize_y'], 5, 3, 23, t => (t as UnsharpFilter).#chromaY, (t, v) => (t as UnsharpFilter).#chromaY = v),
		Filter._nprop(5, ['ca', 'chroma_amount'], 0, -2, 5, t => (t as UnsharpFilter).#chromaAmount, (t, v) => (t as UnsharpFilter).#chromaAmount = v),
		Filter._nprop(6, ['ax', 'alpha_msize_x'], 5, 3, 23, t => (t as UnsharpFilter).#alphaX, (t, v) => (t as UnsharpFilter).#alphaX = v),
		Filter._nprop(7, ['ay', 'alpha_msize_y'], 5, 3, 23, t => (t as UnsharpFilter).#alphaY, (t, v) => (t as UnsharpFilter).#alphaY = v),
		Filter._nprop(8, ['aa', 'alpha_amount'], 0, -2, 5, t => (t as UnsharpFilter).#alphaAmount, (t, v) => (t as UnsharpFilter).#alphaAmount = v),
	]
}
