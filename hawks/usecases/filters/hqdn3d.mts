import { Filter, FilterProperty } from './base.mjs'

export class HQDeNoise3DFilter extends Filter {
	#lumaSpatial = 4
	#chromaSpatial!: number
	#lumaTemporal!: number
	#chromaTemporal!: number

	constructor(str?: string) {
		super('video')

		let i = 0
		if (typeof str === 'string') {
			i = this._parseFromDefines(str, HQDeNoise3DFilter.properties)
		}
		switch (i) {
		case 2:
			this.#lumaTemporal = 6 * this.#lumaSpatial / 4
			this.#chromaTemporal = this.#lumaTemporal * this.#chromaSpatial / this.#lumaSpatial
			break
		case 3:
			this.#chromaTemporal = this.#lumaTemporal * this.#chromaSpatial / this.#lumaSpatial
			break
		case 4:
			break
		default:
			this.#chromaSpatial = 3 * this.#lumaSpatial / 4
			this.#lumaTemporal = 6 * this.#lumaSpatial / 4
			this.#chromaTemporal = this.#lumaTemporal * this.#chromaSpatial / this.#lumaSpatial
			break
		}
	}

	lumaSpatial(value: number) {
		if (value < 0) {
			throw new Error('No negative number.')
		}
		this.#lumaSpatial = value
		return this
	}

	chromaSpatial(value: number) {
		if (value < 0) {
			throw new Error('No negative number.')
		}
		this.#chromaSpatial = value
		return this
	}

	lumaTemporal(value: number) {
		if (value < 0) {
			throw new Error('No negative number.')
		}
		this.#lumaTemporal = value
		return this
	}

	chromaTemporal(value: number) {
		if (value < 0) {
			throw new Error('No negative number.')
		}
		this.#chromaTemporal = value
		return this
	}

	override build(): string {
		return this._buildFromDefines(
			HQDeNoise3DFilter.filterName,
			HQDeNoise3DFilter.properties,
		)
	}

	// Getters for testing.
	getLumaSpatial(): number {
		return this.#lumaSpatial
	}
	getChromaSpatial(): number {
		return this.#chromaSpatial
	}
	getLumaTemporal(): number {
		return this.#lumaTemporal
	}
	getChromaTemporal(): number {
		return this.#chromaTemporal
	}

	static override readonly filterName = 'hqdn3d'

	static override readonly properties: FilterProperty[] = [
		Filter._nprop(0, null, 4, 0, Infinity, t => (t as HQDeNoise3DFilter).#lumaSpatial, (t, v) => (t as HQDeNoise3DFilter).#lumaSpatial = v),
		Filter._nprop(1, null, 3, 0, Infinity, t => (t as HQDeNoise3DFilter).#chromaSpatial, (t, v) => (t as HQDeNoise3DFilter).#chromaSpatial = v),
		Filter._nprop(2, null, 6, 0, Infinity, t => (t as HQDeNoise3DFilter).#lumaTemporal, (t, v) => (t as HQDeNoise3DFilter).#lumaTemporal = v),
		Filter._nprop(3, null, 4.5, 0, Infinity, t => (t as HQDeNoise3DFilter).#chromaTemporal, (t, v) => (t as HQDeNoise3DFilter).#chromaTemporal = v),
	]
}
