import { Filter, FilterType } from './base.mjs'

export class RawFilter extends Filter {
	#value: string

	constructor(type: FilterType, str?: string) {
		if (typeof str !== 'string') {
			throw new Error('Invalid params.')
		}

		super(type)

		this.#value = str
	}

	value(value: string) {
		this.#value = value
		return this
	}

	override build(): string {
		return this.#value
	}
}
