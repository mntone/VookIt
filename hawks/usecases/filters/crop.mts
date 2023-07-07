import { Size } from '../../models/Size.mjs'

import { Filter } from './base.mjs'

export class CropFilter extends Filter {
	#width = 0
	#height = 0
	#cropX: string | number = '(iw-ow)/2'
	#cropY: string | number = '(ih-oh)/2'
	#exact = true

	constructor(str?: string) {
		super('video')

		if (typeof str === 'string') {
			if (str.startsWith('crop=')) {
				str = str.substring(5)
			}

			let i = 0
			const params = str.split(':')
			for (const param of params) {
				if (params.includes('=')) {
					const [key, value] = param
					switch (key) {
					case 'w':
					case 'width':
						this.#width = Number(value)
						break
					case 'h':
					case 'height':
						this.#height = Number(value)
						break
					case 'x':
						this.#cropX = value
						break
					case 'y':
						this.#cropY = value
						break
					case 'exact':
						this.#exact = value === '1'
						break
					default:
						break
					}
				} else {
					switch (i++) {
					case 0:
						this.#width = Number(param)
						break
					case 1:
						this.#height = Number(param)
						break
					case 2:
						this.#cropX = param
						break
					case 3:
						this.#cropY = param
						break
					default:
						break
					}
				}
			}
		}
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

	exact(value: boolean) {
		this.#exact = value
		return this
	}

	override build(): string[] {
		const footer = this.#exact ? ':exact=1' : ''
		return [`crop=${this.#width}:${this.#height}:${this.#cropX}:${this.#cropY}` + footer]
	}

	static override readonly filterName = 'crop'
}
