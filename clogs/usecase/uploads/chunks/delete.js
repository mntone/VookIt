const { rm } = require('fs/promises')

const isCUID = require('../../../utils/validators/isCUID')
const prisma = require('../../prisma')
const ValidationError = require('../../ValidationError')
const { existsTemporaryUploadDir } = require('../utils')

/**
 * @param   {string}        cuid
 * @returns {Promise<void>}
 */
module.exports = async cuid => {
	// Validate params.
	if (!isCUID(cuid)) {
		throw new ValidationError('cuid')
	}

	// Exist temporary directory.
	const dirname = existsTemporaryUploadDir(cuid)

	// Delete temporary upload directory.
	await rm(dirname, { force: true, recursive: true, maxRetries: 2 })

	// Remove upload from database.
	await prisma.upload.delete({
		select: {
			startedAt: true,
		},
		where: {
			cuid,
		},
	})
}
