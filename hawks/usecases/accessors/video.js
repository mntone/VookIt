const deepFreeze = require('deep-freeze')

const share = require('./share')

/**
 * @param   {string} str
 * @returns {object}
 */
function parseFramerate(str) {
	const [numerator, denominator] = str.split('/', 2)[0]
	return {
		numerator: Number(numerator),
		denominator: Number(denominator),
	}
}

module.exports = deepFreeze({
	...share,
	/* eslint-disable camelcase */
	bitrate: {
		type: 'number',
		accessor: info => Number(info.bit_rate),
	},
	chromaLocation: {
		type: 'string',
		accessor: info => info.chroma_location,
	},
	colorRange: {
		type: 'string',
		accessor: info => info.color_range,
	},
	colorSpace: {
		type: 'string',
		accessor: info => info.color_space,
	},
	colorTransfer: {
		type: 'string',
		accessor: info => info.color_transfer,
	},
	colorPrimaries: {
		type: 'string',
		accessor: info => info.color_primaries,
	},
	fieldOrder: {
		type: 'string',
		accessor: info => info.field_order,
	},
	framerate: {
		type: 'framerate',
		accessor: info => parseFramerate(info.r_frame_rate),
	},
	height: {
		type: 'number',
		accessor: info => Number(info.height),
	},
	maximumLength: {
		type: 'number',
		accessor: info => Math.max(Number(info.width), Number(info.height)),
	},
	minimumLength: {
		type: 'number',
		accessor: info => Math.min(Number(info.width), Number(info.height)),
	},
	pixelFormat: {
		type: 'string',
		accessor: info => info.pix_fmt,
	},
	sampleRate: {
		type: 'number',
		accessor: info => {
			const sampleRate = Number(info.sample_rate)
			if (!Number.isInteger(sampleRate)) {
				throw Error('hawks.error.parse.audio.samplerate')
			}
			return sampleRate
		},
	},
	width: {
		type: 'number',
		accessor: info => Number(info.width),
	},
	/* eslint-enable camelcase */
})
