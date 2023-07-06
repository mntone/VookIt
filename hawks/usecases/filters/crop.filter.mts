import { Size } from '../../models/Size.mjs'

import { BaseFilter } from './base.filter.mjs'

export class CropFilter extends BaseFilter {
	#width = 0
	#height = 0
	#cropX: string | number = '(iw-ow)/2'
	#cropY: string | number = '(ih-oh)/2'

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

	cropX(value: string | number) {
		this.#cropX = value
		return this
	}

	cropY(value: string | number) {
		this.#cropY = value
		return this
	}

	crop(valueX: string | number, valueY: string | number) {
		this.#cropX = valueX
		this.#cropY = valueY
		return this
	}

	override build(): string | null {
		return `crop=${this.#width}:${this.#height}:${this.#cropX}:${this.#cropY}:exact=1`
	}
}
