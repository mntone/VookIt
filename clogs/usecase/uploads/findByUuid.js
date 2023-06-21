const validator = require('validator')

const prisma = require('../prisma')
const ValidationError = require('../ValidationError')

/**
 * Find a upload by uuid.
 * @param   {string}                                   uuid
 * @returns {Promise<import('@prisma/client').Upload>}
 */
module.exports = async uuid => {
	// Validate params.
	if (!validator.isUUID(uuid)) {
		throw ValidationError('uuid')
	}

	// Find a upload by uuid.
	const upload = await prisma.upload.findUnique({
		where: {
			uuid,
		},
	})
	return upload
}
