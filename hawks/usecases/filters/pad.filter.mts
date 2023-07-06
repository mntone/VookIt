import { Size } from '../../models/Size.mjs'

import { BaseFilter } from './base.filter.mjs'

export class PadFilter extends BaseFilter {
	#width = 0
	#height = 0
	#padX = -1
	#padY = -1

	constructor() {
		super('video')
	}

	width(value: number) {
		this.#width = value
		return this
	}

	height(value: number) {
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

	padX(value: number) {
		this.#padX = value
		return this
	}

	padY(value: number) {
		this.#padY = value
		return this
	}

	pad(valueX: number, valueY: number) {
		this.#padX = valueX
		this.#padY = valueY
		return this
	}

	override build(): string | null {
		return `pad=${this.#width}:${this.#height}:${this.#padX}:${this.#padY}`
	}
}
