import { Filter, FilterType } from './base.mjs'
import { CropFilter } from './crop.mjs'
import { HQDeNoise3DFilter } from './hqdn3d.mjs'
import { PadFilter } from './pad.mjs'
import { RawFilter } from './raw.mjs'

export * from './base.mjs'
export * from './crop.mjs'
export * from './pad.mjs'
export * from './video.mjs'

export function getAllFilters(): Record<string, (new (s?: string) => Filter) | undefined> {
	return {
		...getVideoFilters(),
	}
}

export function getVideoFilters(): Record<string, (new (s?: string) => Filter) | undefined> {
	return {
		crop: CropFilter,
		hqdn3d: HQDeNoise3DFilter,
		pad: PadFilter,
	}
}

export class Filters {
	#filters: Filter[] = []

	constructor(type: FilterType, fstrs?: string[]) {
		if (fstrs) {
			const dict = getVideoFilters()
			for (const fstr of fstrs) {
				const [key, value] = fstr.split('=', 2)
				const keyClass = dict[key]
				if (keyClass) {
					const filter = new keyClass(value)
					this.#filters.push(filter)
				} else {
					const filter = new RawFilter(fstr)
					this.#filters.push(filter)
				}
			}
		}
	}

	get filters() {
		return this.#filters
	}

	add(filter: Filter) {
		this.#filters.push(filter)
		return this
	}

	build(): string {
		return this.#filters.flatMap(f => f.build()).join(',')
	}
}
