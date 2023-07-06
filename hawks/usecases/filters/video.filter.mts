import deepFreeze from 'deep-freeze'

import {
	ColorPrimaries,
	ColorRange,
	MatrixCoefficients,
	Size,
	TransferCharacteristics,
} from '../../models/_index.mjs'
import { ResizeMethod } from '../../models/encoders/EncodeOptions.mjs'
import { ImageData } from '../../models/encoders/MediaData.mjs'

import { BaseFilter } from './base.filter.mjs'

// https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/vf_colorspace.c
const colorspaceTable = deepFreeze({
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
	resize: {
		key: 'f', // or "filter"
		values: {
			// eslint-disable-next-line camelcase
			nearest: 'point',
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
			['bt2020-10']: '2020_10', // or "bt2020-10"
			['bt2020-12']: '2020_12', // or "bt2020-12"
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

export type VideoFilterOptions = {
	useSwscaleForResize?: boolean
}

export class VideoFilter extends BaseFilter {
	#options: VideoFilterOptions

	#resizeMethod?: ResizeMethod

	readonly #srcWidth: number
	#dstWidth?: number

	readonly #srcHeight: number
	#dstHeight?: number

	readonly #srcColorRange: ColorRange
	#dstColorRange?: ColorRange

	readonly #srcMatrixCoefficients: MatrixCoefficients
	#dstMatrixCoefficients?: MatrixCoefficients

	readonly #srcColorPrimaries: ColorPrimaries
	#dstColorPrimaries?: ColorPrimaries

	readonly #srcTransferCharacteristics: TransferCharacteristics
	#dstTransferCharacteristics?: TransferCharacteristics

	constructor(data: ImageData, options?: VideoFilterOptions) {
		super('video')

		this.#options = options || {}
		this.#srcWidth = data.width
		this.#srcHeight = data.height
		this.#srcColorRange = data.colorRange
		this.#srcMatrixCoefficients = data.matrixCoefficients
		this.#srcColorPrimaries = data.colorPrimaries
		this.#srcTransferCharacteristics = data.transferCharacteristics
	}

	resizeMethod(value?: ResizeMethod) {
		this.#resizeMethod = value
		return this
	}

	width(value: number) {
		if (this.#srcWidth !== this.#dstWidth) {
			this.#dstWidth = value
		} else {
			this.#dstWidth = undefined
		}
		return this
	}

	height(value: number) {
		if (this.#srcHeight !== this.#dstHeight) {
			this.#dstHeight = value
		} else {
			this.#dstHeight = undefined
		}
		return this
	}

	size(value: Size) {
		return this.width(value.width).height(value.height)
	}

	colorRange(value?: ColorRange) {
		if (this.#srcColorRange !== this.#dstColorRange) {
			this.#dstColorRange = value
		} else {
			this.#dstColorRange = undefined
		}
		return this
	}

	matrixCoefficients(value?: MatrixCoefficients) {
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

	transferCharacteristics(value?: TransferCharacteristics) {
		if (this.#srcTransferCharacteristics !== this.#dstTransferCharacteristics) {
			this.#dstTransferCharacteristics = value
		} else {
			this.#dstTransferCharacteristics = undefined
		}
		return this
	}

	normalizeColors(data: ImageData) {
		switch (data.colorPrimaries) {
		case 'bt709': // BT.709 or sRGB
			if (data.transferCharacteristics !== 'srgb') {
				this.transferCharacteristics('bt709')
			}
			this.matrixCoefficients('bt709')
			break
		case 'bt470bg': // BT.601
			this.transferCharacteristics('smpte170m').matrixCoefficients('bt470bg')
			break
		case 'dcip3': // DCI-P3
			this.transferCharacteristics('srgb').matrixCoefficients('bt470bg')
			break
		case 'displayp3': // Display P3
			this.transferCharacteristics('srgb').matrixCoefficients('bt709')
			break
		case 'bt2020': // BT.2020
			if (data.transferCharacteristics !== 'bt2020-12') {
				this.transferCharacteristics('bt2020-10')
			}
			this.matrixCoefficients('bt2020nc')
			break
		default: // Force BT.709
			this.colorPrimaries('bt709').transferCharacteristics('bt709').matrixCoefficients('bt709')
			break
		}
		return this
	}

	#buildSize() {
		if (this.#dstWidth) {
			if (this.#dstHeight) {
				return `${this.#dstWidth}:${this.#dstHeight}`
			} else {
				return `${this.#dstWidth}:${this.#srcHeight}`
			}
		} else if (this.#dstHeight) {
			return `${this.#srcWidth}:${this.#dstHeight}`
		} else {
			return null
		}
	}

	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#buildColor(table: any): string | null {
		const args = []

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
		return commands
	}
	/* eslint-enable @typescript-eslint/no-non-null-assertion */

	override build(): string | null {
		const sizeCommand = this.#buildSize()
		if (sizeCommand) {
			if (this.#options.useSwscaleForResize) {
				const colorCommands = this.#buildColor(zscaleTable)
				return colorCommands
					? `zscale=${colorCommands},scale=${sizeCommand}`
					: `scale=${sizeCommand}`
			} else if (VideoFilter.#useZImg) {
				const colorCommands = this.#buildColor(zscaleTable)
				return colorCommands
					? `zscale=${sizeCommand}:f=${this.#resizeMethod ?? 'bilinear'}:${colorCommands}`
					: `zscale=${sizeCommand}:f=${this.#resizeMethod ?? 'bilinear'}`
			} else {
				const colorCommands = this.#buildColor(colorspaceTable)
				return colorCommands
					? `scale=${sizeCommand},colorspace=` + colorCommands
					: 'scale=' + sizeCommand
			}
		} else {
			if (VideoFilter.#useZImg) {
				const colorCommands = this.#buildColor(zscaleTable)
				return colorCommands ? 'zscale=' + colorCommands : null
			} else {
				const colorCommands = this.#buildColor(colorspaceTable)
				return colorCommands ? 'colorspace=' + colorCommands : null
			}
		}
	}

	get src(): ColorRange | undefined {
		return this.src
	}

	static #useZImg = false

	static get useZImg(): boolean {
		return VideoFilter.#useZImg
	}
	static set useZImg(value: boolean) {
		VideoFilter.#useZImg = value
	}
}
