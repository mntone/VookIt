const deepFreeze = require('deep-freeze')

/**
 * @type {import('express-validator').Schema}
 */
const schema = {
	until: {
		in: 'query',
		errorMessage: 'toppage.error.until',
		optional: {
			options: { nullable: true },
		},
		isInt: true,
	},
}

module.exports = deepFreeze(schema)
