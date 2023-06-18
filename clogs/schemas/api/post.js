const deepFreeze = require('deep-freeze')
const { checkSchema } = require('express-validator')

// Load environment constants
const env = require('../../../constants/env')

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
			options: [['.html', '.json', '.msgpack']],
		},
	},
	uuid: {
		in: 'body',
		isUUID: true,
	},
	title: {
		in: 'body',
		isString: true,
		isLength: env.titleLength,
	},
	description: {
		in: 'body',
		isString: true,
		isLength: env.descriptionLength,
	},
}

module.exports = checkSchema(deepFreeze(schema))
