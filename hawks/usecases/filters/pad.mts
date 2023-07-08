import { Size } from '../../models/Size.mjs'

import { Filter, FilterProperty } from './base.mjs'

export class PadFilter extends Filter {
	#width: string | number = 'iw'
	#height: string | number = 'ih'
	#padX: string | number = 0
	#padY: string | number = 0

	constructor(str?: string) {
		super('video')

		if (typeof str === 'string') {
			this._parseFromDefines(str, PadFilter.properties)
		}
	}

	width(value: string | number) {
		this.#width = value
		return this
	}

	height(value: string | number) {
		this.#height = value
		return this
	}

	size(value: Size | number, height: number) {
		if (typeof value === 'object') {
			this.#width = value.width
			this.#height = value.height
		} else if (typeof value === 'number') {
			this.#width = value
			this.#height = height
		} else {
			throw new Error('Unknown parameters.')
		}
		return this
	}

	padX(value: string | number) {
		this.#padX = value
		return this
	}

	padY(value: string | number) {
		this.#padY = value
		return this
	}

	pad(valueX: string | number, valueY: string | number) {
		this.#padX = valueX
		this.#padY = valueY
		return this
	}

	override build(): string {
		return this._buildFromDefines(
			PadFilter.filterName,
			PadFilter.properties,
		)
	}

	// Getters for testing.
	getWidth(): string | number {
		return this.#width
	}
	getHeight(): string | number {
		return this.#height
	}
	getPadX(): string | number {
		return this.#padX
	}
	getPadY(): string | number {
		return this.#padY
	}

	static override readonly filterName = 'pad'

	static override readonly properties: FilterProperty[] = [
		Filter._prop(0, ['w', 'width'], 'iw', t => (t as PadFilter).#width, (t, v) => (t as PadFilter).#width = Filter._getAsStringOrNumber(v)),
		Filter._prop(1, ['h', 'height'], 'ih', t => (t as PadFilter).#height, (t, v) => (t as PadFilter).#height = Filter._getAsStringOrNumber(v)),
		Filter._prop(2, ['x'], 0, t => (t as PadFilter).#padX, (t, v) => (t as PadFilter).#padX = Filter._getAsStringOrNumber(v)),
		Filter._prop(3, ['y'], 0, t => (t as PadFilter).#padY, (t, v) => (t as PadFilter).#padY = Filter._getAsStringOrNumber(v)),
	]
}
