const deepFreeze = require('deep-freeze')

const share = require('./share')

module.exports = deepFreeze({
	/* eslint-disable camelcase */
	...share,
	channels: {
		type: 'number',
		accessor: info => Number(info.channels),
	},
	sampleRate: {
		type: 'number',
		accessor: info => {
			const sampleRate = Number(info.sample_rate)
			if (!Number.isInteger(sampleRate)) {
				throw Error('audio.sample_rate')
			}
			return sampleRate
		},
	},
	/* eslint-enable camelcase */
})
