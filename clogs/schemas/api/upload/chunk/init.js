const deepFreeze = require('deep-freeze')

const env = require('../../../../../constants/env')

/**
 * @type {import('express-validator').Schema}
 */
const schema = {
	format: {
		in: 'params',
		optional: {
			options: { nullable: true },
		},
		isIn: {
			options: [['.json', '.msgpack']],
		},
	},
	name: {
		in: 'body',
		isString: true,
	},
	size: {
		in: 'body',
		isInt: {
			options: {
				max: env.uploadMaxTotalSize,
			},
		},
		toInt: true,
	},
	hash: {
		in: 'body',
		isString: true,
	},
}

module.exports = deepFreeze(schema)
