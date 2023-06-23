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
	visibility: {
		in: 'body',
		isIn: {
			options: [['private', 'public']],
		},
	},
}

module.exports = deepFreeze(schema)
