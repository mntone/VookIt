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
	cuid: {
		in: 'body',
		isString: true,
		isLength: {
			options: {
				min: 25,
				max: 25,
			},
		},
	},
}

module.exports = deepFreeze(schema)
