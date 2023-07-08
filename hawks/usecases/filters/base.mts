import { equalsNumber } from '../../utils/number.mjs'

export type FilterType = 'audio' | 'video'

export type FilterProperty = {
	propertyType: 'any' | 'number' | 'boolean'
	parameterNames: string[]
	index: number | null
	/* eslint-disable @typescript-eslint/no-explicit-any */
	getValue: (self: Filter) => any
	setValue: (self: Filter, value: any) => void
	defaultValue: any
	/* eslint-enable @typescript-eslint/no-explicit-any */
}

type FilterPropertyBase = Omit<Omit<Omit<FilterProperty, 'getValue'>, 'setValue'>, 'defaultValue'>

export type BooleanFilterProperty = FilterPropertyBase & {
	propertyType: 'boolean'
	getValue: (self: Filter) => boolean
	setValue: (self: Filter, value: boolean) => void
	defaultValue: boolean
}

export type NumberFilterProperty = FilterPropertyBase & {
	propertyType: 'number'
	getValue: (self: Filter) => number
	setValue: (self: Filter, value: number) => void
	defaultValue: number
	minimumValue: number
	maximumValue: number
}

export abstract class Filter {
	/**
	 * Filter targat type
	 */
	#type: FilterType

	constructor(type: FilterType) {
		this.#type = type
	}

	build(): string {
		throw Error('This function must be overridden.')
	}

	/**
	 * Filter targat type
	 * @returns The type
	 */
	get type(): FilterType {
		return this.#type
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#parseValue(prop: FilterProperty | undefined, value: any) {
		if (prop) {
			if (prop.propertyType === 'number') {
				const nprop = prop as NumberFilterProperty
				const num = Number(value)
				if (Number.isNaN(num)) {
					nprop.setValue(this, nprop.defaultValue)
				} else {
					nprop.setValue(this, Math.max(nprop.minimumValue, Math.min(nprop.maximumValue, num)))
				}
			} else if (prop.propertyType === 'boolean') {
				const bprop = prop as BooleanFilterProperty
				const flag = value === '1'
				bprop.setValue(this, flag)
			} else {
				prop.setValue(this, value)
			}
			return true
		}
		return false
	}

	_parseFromDefines(str: string, properties: FilterProperty[]) {
		let i = 0
		const params = str.split(':')
		for (const param of params) {
			if (param.includes('=')) {
				const [key, value] = param.split('=', 2)
				const prop = properties.find(p => p.parameterNames.includes(key))
				this.#parseValue(prop, value)
			} else {
				const prop = properties.find(p => p.index === i)
				if (this.#parseValue(prop, param)) {
					++i
				}
			}
		}
		return i
	}

	_buildFromDefines(name: string, properties: FilterProperty[]): string {
		const args: string[] = []
		const pairs: Record<string, string> = {}

		for (const prop of properties.slice().reverse()) {
			if (prop.propertyType === 'number') {
				const nprop = prop as NumberFilterProperty
				const propertyValue = nprop.getValue(this)
				if (nprop.index === null) {
					if (propertyValue !== nprop.defaultValue) {
						pairs[nprop.parameterNames[0]] = propertyValue.toString()
					}
				} else if (args.length !== 0 || !equalsNumber(propertyValue, nprop.defaultValue)) {
					args.unshift(propertyValue.toString())
				}
			} else if (prop.propertyType === 'boolean') {
				const bprop = prop as BooleanFilterProperty
				const propertyValue = bprop.getValue(this)
				if (bprop.index === null) {
					if (propertyValue !== bprop.defaultValue) {
						pairs[bprop.parameterNames[0]] = propertyValue ? '1' : '0'
					}
				} else if (args.length !== 0 || propertyValue !== bprop.defaultValue) {
					args.unshift(propertyValue ? '1' : '0')
				}
			} else {
				const propertyValue = prop.getValue(this)
				if (prop.index === null) {
					if (propertyValue !== prop.defaultValue) {
						pairs[prop.parameterNames[0]] = propertyValue.toString()
					}
				} else if (args.length !== 0 || propertyValue !== prop.defaultValue) {
					args.unshift(propertyValue.toString())
				}
			}
		}

		args.push(...Object.entries(pairs).map(([k, v]) => `${k}=${v}`))
		if (args.length !== 0) {
			return name + '=' + args.join(':')
		} else {
			return name
		}
	}

	/**
	 * Filter name
	 * @returns The filter name
	 */
	static readonly filterName: string | null = null

	static readonly properties: FilterProperty[] = []

	/* eslint-disable @typescript-eslint/no-explicit-any */
	static _prop(
		index: number | null,
		parameterNames: string[] | null,
		def: any,
		get: (self: Filter) => any,
		set: (self: Filter, value: any) => void,
	): FilterProperty {
		return {
			propertyType: 'any',
			parameterNames: parameterNames ?? [],
			index,
			getValue: get,
			setValue: set,
			defaultValue: def,
		}
	}
	/* eslint-enable @typescript-eslint/no-explicit-any */

	static _bprop(
		index: number | null,
		parameterNames: string[] | null,
		def: boolean,
		get: (self: Filter) => boolean,
		set: (self: Filter, value: boolean) => void,
	): BooleanFilterProperty {
		return {
			propertyType: 'boolean',
			parameterNames: parameterNames ?? [],
			index,
			getValue: get,
			setValue: set,
			defaultValue: def,
		}
	}

	static _nprop(
		index: number | null,
		parameterNames: string[] | null,
		def: number,
		min: number,
		max: number,
		get: (self: Filter) => number,
		set: (self: Filter, value: number) => void,
	): NumberFilterProperty {
		return {
			propertyType: 'number',
			parameterNames: parameterNames ?? [],
			index,
			getValue: get,
			setValue: set,
			defaultValue: def,
			minimumValue: min,
			maximumValue: max,
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static _getAsStringOrNumber(value: any): string | number {
		const num = Number(value)
		if (Number.isNaN(num)) {
			if (typeof value !== 'string') {
				throw new Error('Invalid type.')
			}
			return value as string
		} else {
			return num
		}
	}
}
