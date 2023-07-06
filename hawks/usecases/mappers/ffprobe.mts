import {
	ColorPrimaries,
	ColorRange,
	MatrixCoefficients,
	TransferCharacteristics,
} from '../../models/Colors.mjs'
import {
	FFproveColorPrimaries,
	FFproveColorRange,
	FFproveColorSpace,
	FFproveColorTransfer,
} from '../../models/trampolines/FFprobeStreamEntries.mjs'

export function normalizeColorRange(inColorRange: FFproveColorRange): ColorRange {
	switch (inColorRange) {
	case 'mpeg':
		return 'tv'
	case 'jpeg':
		return 'pc'
	default:
		return inColorRange
	}
}

export function normalizeColorPrimaries(inColorPrimaries: FFproveColorPrimaries): ColorPrimaries {
	switch (inColorPrimaries) {
	case 'smpte431':
		return 'dcip3'
	case 'smpte432':
		return 'displayp3'
	default:
		return inColorPrimaries
	}
}

export function normalizeMatrixCoefficients(inColorSpace: FFproveColorSpace): MatrixCoefficients {
	switch (inColorSpace) {
	case 'rgb':
		return 'gbr'
	default:
		return inColorSpace
	}
}

const hdrColorTransfers: TransferCharacteristics[] = [
	'pq',
	'hlg',
]

export function isHDR(colorTransfer: TransferCharacteristics) {
	return hdrColorTransfers.includes(colorTransfer)
}

export function normalizeColorTransfer(inColorTransfer: FFproveColorTransfer): TransferCharacteristics {
	switch (inColorTransfer) {
	case 'gamma22':
		return 'bt470m'
	case 'gamma28':
		return 'bt470bg'
	case 'log':
		return 'log100'
	case 'log_sqrt':
		return 'log316'
	case 'bt1361e':
		return 'bt1361'
	case 'iec61966-2-1':
		return 'srgb'
	case 'iec61966-2-4':
		return 'xvycc'
	case 'smpte2084':
		return 'pq'
	case 'smpte428_1':
		return 'smpte428'
	case 'arib-std-b67':
		return 'hlg'
	default:
		return inColorTransfer
	}
}
