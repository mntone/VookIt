const deepFreeze = require('deep-freeze')

module.exports = deepFreeze({
	/* eslint-disable camelcase */
	bitrate: {
		type: 'string',
		accessor: info => Number(info.bit_rate),
	},
	duration: {
		type: 'number',
		accessor: info => Number(info.duration),
	},
	filename: {
		type: 'string',
		accessor: info => info.filename,
	},
	filesize: {
		type: 'number',
		accessor: info => Number(info.size),
	},
	programs: {
		type: 'number',
		accessor: info => Number(info.nb_programs),
	},
	streams: {
		type: 'number',
		accessor: info => Number(info.nb_streams),
	},
	/* eslint-enable camelcase */
})
