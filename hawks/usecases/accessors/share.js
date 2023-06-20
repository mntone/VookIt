module.exports = {
	/* eslint-disable camelcase */
	codecType: {
		type: 'string',
		accessor: info => info.codec_type,
	},
	codecName: {
		type: 'string',
		accessor: info => info.codec_name,
	},
	profile: {
		type: 'string',
		accessor: info => info.profile,
	},
	bitrate: {
		type: 'number',
		accessor: info => Number(info.bit_rate),
	},
	duration: {
		type: 'number',
		accessor: info => Number(info.duration),
	},
	/* eslint-enable camelcase */
}
