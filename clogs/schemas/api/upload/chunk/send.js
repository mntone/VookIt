const deepFreeze = require('deep-freeze')

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
}

module.exports = deepFreeze(schema)
