const validator = require('express-validator')

module.exports = Object.freeze({
	param: Object.freeze({
		uuid: validator.param('uuid').isUUID(),
		format: validator.param('format').isIn(['.xml', '.json', '.msgpack']).optional(),
		formatWithHtml: validator.param('format').isIn(['.html', '.xml', '.json', '.msgpack']).optional(),
	}),
})
