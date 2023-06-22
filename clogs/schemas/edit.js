const deepFreeze = require('deep-freeze')

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
}

module.exports = deepFreeze(schema)
