const deepFreeze = require('deep-freeze')

const env = require('../../../../constants/env')

/**
 * @type {import('express-validator').Schema}
 */
const schema = {
	id: {
		in: 'params',
		errorMessage: 'viewpage.error.id',
		isBase64: {
			options: { urlSafe: true },
		},
	},
	format: {
		in: 'params',
		optional: {
			options: { nullable: true },
		},
		isIn: {
			options: [['.json', '.msgpack']],
		},
	},
	title: {
		in: 'body',
		optional: {
			options: { nullable: true },
		},
		isString: true,
		isLength: env.titleLength,
	},
	description: {
		in: 'body',
		optional: {
			options: { nullable: true },
		},
		isString: true,
		isLength: env.descriptionLength,
	},
}

module.exports = deepFreeze(schema)
