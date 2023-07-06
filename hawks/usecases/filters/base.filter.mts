
export type FilterType = 'audio' | 'video'

export class BaseFilter {
	/**
	 * Filter targat type
	 */
	#type: FilterType | FilterType[]

	constructor(type: FilterType | FilterType[]) {
		this.#type = type
	}

	build(): string | null {
		throw Error('This property must be overridden.')
	}

	/**
	 * Filter targat type
	 * @returns The type or array of types
	 */
	get type(): FilterType | FilterType[] {
		return this.#type
	}
}
