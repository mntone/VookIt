import { Size } from '../../models/Size.mjs'

import { Filter, FilterProperty } from './base.mjs'

export class CropFilter extends Filter {
	#width: string | number = 'iw'
	#height: string | number = 'ih'
	#cropX: string | number = '(iw-ow)/2'
	#cropY: string | number = '(ih-oh)/2'
	#keepAspect = false
	#exact = false

	constructor(str?: string) {
		super('video')

		if (typeof str === 'string') {
			this._parseFromDefines(str, CropFilter.properties)
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

	keepAspect(value: boolean) {
		this.#keepAspect = value
		return this
	}

	exact(value: boolean) {
		this.#exact = value
		return this
	}

	override build(): string {
		return this._buildFromDefines(
			CropFilter.filterName,
			CropFilter.properties,
		)
	}

	// Getters for testing.
	getWidth(): string | number {
		return this.#width
	}
	getHeight(): string | number {
		return this.#height
	}
	getCropX(): string | number {
		return this.#cropX
	}
	getCropY(): string | number {
		return this.#cropY
	}
	getKeepAspect(): boolean {
		return this.#keepAspect
	}
	getExact(): boolean {
		return this.#exact
	}

	static override readonly filterName = 'crop'

	static override readonly properties: FilterProperty[] = [
		Filter._prop(0, ['w', 'out_w'], 'iw', t => (t as CropFilter).#width, (t, v) => (t as CropFilter).#width = Filter._getAsStringOrNumber(v)),
		Filter._prop(1, ['h', 'out_h'], 'ih', t => (t as CropFilter).#height, (t, v) => (t as CropFilter).#height = Filter._getAsStringOrNumber(v)),
		Filter._prop(2, ['x'], '(iw-ow)/2', t => (t as CropFilter).#cropX, (t, v) => (t as CropFilter).#cropX = Filter._getAsStringOrNumber(v)),
		Filter._prop(3, ['y'], '(ih-oh)/2', t => (t as CropFilter).#cropY, (t, v) => (t as CropFilter).#cropY = Filter._getAsStringOrNumber(v)),
		Filter._bprop(null, ['keep_aspect'], false, t => (t as CropFilter).#keepAspect, (t, v) => (t as CropFilter).#keepAspect = v),
		Filter._bprop(null, ['exact'], false, t => (t as CropFilter).#exact, (t, v) => (t as CropFilter).#exact = v),
	]
}
