const deepFreeze = require('deep-freeze')
const { checkSchema } = require('express-validator')

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

module.exports = checkSchema(deepFreeze(schema))
