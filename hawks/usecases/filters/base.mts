
export type FilterType = 'audio' | 'video'

export abstract class Filter {
	/**
	 * Filter targat type
	 */
	#type: FilterType

	constructor(type: FilterType) {
		this.#type = type
	}

	build(): string[] {
		throw Error('This function must be overridden.')
	}

	/**
	 * Filter targat type
	 * @returns The type
	 */
	get type(): FilterType {
		return this.#type
	}

	/**
	 * Filter name
	 * @returns The filter name
	 */
	static readonly filterName: string | null = null
}
