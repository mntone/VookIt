import { Filter } from './base.mjs'

export class HQDeNoise3DFilter extends Filter {
	#lumaSpatial = 4
	#chromaSpatial
	#lumaTemporal
	#chromaTemporal

	constructor(str?: string) {
		super('video')

		let i = 0
		if (typeof str === 'string') {
			if (str.startsWith('hqdn3d=')) {
				str = str.substring(7)
			}

			const params = str.split(':')
			for (const param of params) {
				switch (i++) {
				case 0:
					this.#lumaSpatial = Math.max(0, Number(param))
					break
				case 1:
					this.#chromaSpatial = Math.max(0, Number(param))
					break
				case 2:
					this.#lumaTemporal = Math.max(0, Number(param))
					break
				case 3:
					this.#chromaTemporal = Math.max(0, Number(param))
					break
				default:
					break
				}
			}
		}
		switch (i) {
		case 2:
			this.#lumaTemporal = 6 * this.#lumaSpatial / 4
			this.#chromaTemporal = this.#lumaTemporal * this.#chromaSpatial! / this.#lumaSpatial
			break
		case 3:
			this.#chromaTemporal = this.#lumaTemporal! * this.#chromaSpatial! / this.#lumaSpatial
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

	override build(): string[] {
		return [`hqdn3d=${this.#lumaSpatial}:${this.#chromaSpatial}:${this.#lumaTemporal}:${this.#chromaTemporal}`]
	}

	static override readonly filterName = 'hqdn3d'
}
