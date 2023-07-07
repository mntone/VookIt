import { Size } from '../../models/Size.mjs'

import { Filter } from './base.mjs'

export class PadFilter extends Filter {
	#width = 0
	#height = 0
	#padX: string | number = 0
	#padY: string | number = 0

	constructor(str?: string) {
		super('video')

		if (typeof str === 'string') {
			if (str.startsWith('pad=')) {
				str = str.substring(4)
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
						this.#padX = value
						break
					case 'y':
						this.#padY = value
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
						this.#padX = param
						break
					case 3:
						this.#padY = param
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

	override build(): string[] {
		return [`pad=${this.#width}:${this.#height}:${this.#padX}:${this.#padY}`]
	}

	static override readonly filterName = 'pad'
}
