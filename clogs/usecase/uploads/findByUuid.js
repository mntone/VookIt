const validator = require('validator')

const prisma = require('../prisma')

/**
 * Find a upload by uuid.
 * @param   {string}                          uuid
 * @returns {import('@prisma/client').Upload}
 */
module.exports = async uuid => {
	// Validate params.
	if (!validator.isUUID(uuid)) {
		throw new Error('uuid')
	}

	// Find a upload by uuid.
	const upload = await prisma.upload.findUnique({
		where: {
			uuid,
		},
	})
	return upload
}
