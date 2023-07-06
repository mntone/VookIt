
export type ColorRange = 'tv' | 'pc'

export type ColorPrimaries
	= 'bt709'		// ITU-R BT.709 primaries
	| 'bt470m'
	| 'bt470bg'
	| 'smpte170m'
	| 'smpte240m'
	| 'film'
	| 'bt2020'		// ITU-R BT.2020 primaries
	| 'smpte428'	// SMPTE ST 428 primaries / CIE 1931 XYZ
	| 'dcip3'		// SMPTE RP 431 primaries
	| 'displayp3'	// SMPTE EG 432 primaries / DCI-P3 D65
	| 'jedec-p22' | 'ebu3213' // JEDEC P22 phosphors / EBU 3213 primaries

export type TransferCharacteristics
	= 'bt709'		// ITU-R BT.709 / ITU-R BT.1361
	| 'bt470m'		// ITU-R BT.470M / Gamma 2.2 curve
	| 'bt470bg'		// ITU-R BT.470BG / Gamma 2.8 curve
	| 'smpte170m'
	| 'smpte240m'
	| 'linear'
	| 'log100'
	| 'log316'
	| 'xvycc'		// IEC61966-2-4
	| 'bt1361'
	| 'srgb'		// IEC61966-2-1
	| 'bt2020-10'	// ITU-R BT.2020 10-bit
	| 'bt2020-12'	// ITU-R BT.2020 12-bit
	| 'pq'			// BT.2100 PQ / SMPTE 2084
	| 'smpte428'
	| 'hlg'			// BT.2100 HLG / ARIB STD-B67

export type MatrixCoefficients
	= 'bt709'
	| 'fcc'
	| 'bt470bg'
	| 'smpte170m'
	| 'smpte240m'
	| 'ycocg'
	| 'gbr'
	| 'bt2020nc'
	| 'bt2020c'
	| 'smpte2085'	// SMPTE ST 2085
