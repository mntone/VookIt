const deepFreeze = require('deep-freeze')

/**
 * @type {import('express-validator').Schema}
 */
const schema = {
	uuid: {
		in: 'params',
		isUUID: true,
	},
}

module.exports = deepFreeze(schema)
