import deepFreeze from 'deep-freeze'

import {
	ColorPrimaries,
	ColorRange,
	MatrixCoefficients,
	TransferCharacteristics,
} from '../../models/_index.mjs'
import { ImageData } from '../../models/encoders/MediaData.mjs'

import { BaseFilter } from './base.filter.mjs'

// https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/vf_colorspace.c
const colorspaceTable = deepFreeze({
	name: 'colorspace',
	colorRange: {
		in: 'irange',
		out: 'range',
		values: {
			tv: 'tv',	// or "mpeg"
			pc: 'pc',	// or "jpeg"
		},
	},
	colorPrimaries: {
		in: 'iprimaries',
		out: 'primaries',
		values: {
			bt709: 'bt709',
			bt470m: 'bt470m',
			bt470bg: 'bt470bg',
			smpte170m: 'smpte170m',
			smpte240m: 'smpte240m',
			smpte428: 'smpte428',
			film: 'film',
			dcip3: 'smpte431',
			displayp3: 'smpte432',
			bt2020: 'bt2020',
			['jedec-p22']: 'jedec-p22',
			ebu3213: 'ebu3213',
		},
	},
	transferCharacteristics: { // gamma
		in: 'itrc',
		out: 'trc',
		values: {
			bt709: 'bt709',
			bt470m: 'bt470m',
			bt470bg: 'bt470bg',
			smpte170m: 'smpte170m',
			smpte240m: 'smpte240m',
			linear: 'linear',
			srgb: 'srgb', // or "iec61966-2-1"
			xvycc: 'xvycc', // or "iec61966-2-4"
			['bt2020-10']: 'bt2020-10',
			['bt2020-12']: 'bt2020-12',
		},
	},
	matrixCoefficients: { // YUV <=> RGB
		in: 'ispace',
		out: 'space',
		values: {
			bt709: 'bt709',
			fcc: 'fcc',
			bt470bg: 'bt470bg',
			smpte170m: 'smpte170m',
			smpte240m: 'smpte240m',
			ycocg: 'ycgco',
			gbr: 'gbr',
			bt2020nc: 'bt2020nc',
		},
	},
})

// https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/vf_zscale.c
const zscaleTable = deepFreeze({
	name: 'zscale',
	resize: {
		key: 'f', // or "filter"
		values: {
			// eslint-disable-next-line camelcase
			nearest_nightbor: 'point',
			bilinear: 'bilinear',
			bicubic: 'bicubic',
			spline16: 'spline16',
			spline36: 'spline36',
			lanczos: 'lanczos',
		},
	},
	colorRange: {
		in: 'rin',	// or "rangein"
		out: 'r',	// or "range"
		values: {
			tv: 'tv',	// or "limited"
			pc: 'pc',	// or "full"
		},
	},
	colorPrimaries: {
		in: 'pin',	// or "primariesin"
		out: 'p',	// or "primaries"
		values: {
			bt709: '709', // or "bt709"
			bt470m: 'bt470m',
			bt470bg: 'bt470bg',
			smpte170m: '170m', // or "smpte170m"
			smpte240m: '240m', // or "smpte240m"
			smpte428: 'smpte428',
			film: 'film',
			dcip3: 'smpte431',
			displayp3: 'smpte432',
			bt2020: '2020', // or "bt2020"
			['jedec-p22']: 'jedec-p22',
			ebu3213: 'ebu3213',
		},
	},
	transferCharacteristics: { // gamma
		in: 'tin',	// or "transferin"
		out: 't',	// or "transfer"
		values: {
			bt709: '709', // or "bt709"
			bt470m: 'bt470m',
			bt470bg: 'bt470bg',
			smpte170m: 'smpte170m',
			smpte240m: 'smpte240m',
			linear: 'linear',
			log100: 'log100',
			log316: 'log316',
			srgb: 'iec61966-2-1',
			xvycc: 'iec61966-2-4',
			['bt2020-10']: '2020-10', // or "bt2020-10"
			['bt2020-12']: '2020-12', // or "bt2020-12"
			pq: 'smpte2084',
			hlg: 'arib-std-b67',
		},
	},
	matrixCoefficients: { // YUV <=> RGB
		in: 'min',	// or "matrixin"
		out: 'm',	// or "matrix"
		values: {
			bt709: '709', // or "bt709"
			fcc: 'fcc',
			bt470bg: '470bg', // or "bt470bg"
			smpte170m: '170m', // or "smpte170m"
			smpte240m: '240m', // or "smpte240m"
			ycocg: 'ycocg',
			gbr: 'gbr',
			bt2020nc: '2020_ncl', // or "bt2020nc"
			bt2020c: '2020_cl', // or "bt2020c"
		},
	},
})

export class VideoFilter extends BaseFilter {
	#srcColorRange: ColorRange
	#dstColorRange?: ColorRange

	#srcMatrixCoefficients: MatrixCoefficients
	#dstMatrixCoefficients?: MatrixCoefficients

	#srcColorPrimaries: ColorPrimaries
	#dstColorPrimaries?: ColorPrimaries

	#srcTransferCharacteristics: TransferCharacteristics
	#dstTransferCharacteristics?: TransferCharacteristics

	constructor(data: ImageData) {
		super('video')

		this.#srcColorRange = data.colorRange
		this.#srcMatrixCoefficients = data.matrixCoefficients
		this.#srcColorPrimaries = data.colorPrimaries
		this.#srcTransferCharacteristics = data.transferCharacteristics
	}

	colorRange(value: ColorRange) {
		this.#dstColorRange = value
		return this
	}

	matrixCoefficients(value: MatrixCoefficients) {
		if (this.#srcMatrixCoefficients !== this.#dstMatrixCoefficients) {
			this.#dstMatrixCoefficients = value
		} else {
			this.#dstMatrixCoefficients = undefined
		}
		return this
	}

	colorPrimaries(value: ColorPrimaries) {
		this.#dstColorPrimaries = value
		return this
	}

	transferCharacteristics(value: TransferCharacteristics) {
		if (this.#srcTransferCharacteristics !== this.#dstTransferCharacteristics) {
			this.#dstTransferCharacteristics = value
		} else {
			this.#dstTransferCharacteristics = undefined
		}
		return this
	}

	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#build(table: any): string | null {
		const args = []

		// Resize
		// if (table.resize) {
		// 	args.push(`${table.resize}=bicubic`)
		// }

		// Color range
		if (table.colorRange && this.#srcColorRange !== 'tv' && this.#dstColorRange !== 'tv') {
			args.push(`${table.colorRange.in}=${table.colorRange.values[this.#srcMatrixCoefficients]}`)
			args.push(`${table.colorRange.out}=${table.colorRange.values[this.#dstMatrixCoefficients!]}`)
		}

		// Matrix coefficients
		if (table.matrixCoefficients && this.#dstMatrixCoefficients && this.#dstMatrixCoefficients !== this.#srcMatrixCoefficients) {
			args.push(`${table.matrixCoefficients.in}=${table.matrixCoefficients.values[this.#srcMatrixCoefficients]}`)
			args.push(`${table.matrixCoefficients.out}=${table.matrixCoefficients.values[this.#dstMatrixCoefficients!]}`)
		}

		// Color primaries
		if (table.colorPrimaries && this.#dstColorPrimaries && this.#dstColorPrimaries !== this.#srcColorPrimaries) {
			args.push(`${table.colorPrimaries.in}=${table.colorPrimaries.values[this.#srcColorPrimaries]}`)
			args.push(`${table.colorPrimaries.out}=${table.colorPrimaries.values[this.#dstColorPrimaries!]}`)
		}

		// Transfer characteristics
		if (table.transferCharacteristics && this.#dstTransferCharacteristics && this.#dstTransferCharacteristics !== this.#srcTransferCharacteristics) {
			args.push(`${table.transferCharacteristics.in}=${table.transferCharacteristics.values[this.#srcTransferCharacteristics]}`)
			args.push(`${table.transferCharacteristics.out}=${table.transferCharacteristics.values[this.#dstTransferCharacteristics!]}`)
		}

		const commands = args.join(':')
		if (commands.length === 0) {
			return null
		}
		return (table.name as string) + '=' + commands
	}
	/* eslint-enable @typescript-eslint/no-non-null-assertion */

	override build(): string | null {
		if (VideoFilter.#useZImg) {
			return this.#build(zscaleTable)
		} else {
			return this.#build(colorspaceTable)
		}
	}

	get src(): ColorRange | undefined {
		return this.src
	}

	static #useZImg = true

	get useZImg(): boolean {
		return VideoFilter.#useZImg
	}
	set useZImg(value: boolean) {
		VideoFilter.#useZImg = value
	}
}
