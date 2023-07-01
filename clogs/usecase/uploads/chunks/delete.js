const { unlink } = require('fs/promises')
const path = require('path')

const env = require('../../../../constants/env')
const isCUID = require('../../../utils/isCUID')
const prisma = require('../../prisma')
const toInternalErrorOf = require('../../utils/toInternalErrorOf')
const ValidationError = require('../../ValidationError')

/**
 * @param   {string}                          cuid
 * @returns {import('@prisma/client').Upload}
 */
module.exports = async cuid => {
	// Validate params.
	if (!isCUID(cuid)) {
		throw ValidationError('cuid')
	}

	// Find a upload by cuid.
	const upload = await prisma.upload.findUniqueOrThrow({
		where: {
			cuid,
		},
	}).catch(toInternalErrorOf('upload.notfound', 404))

	// Delete temporary upload file.
	const filename = upload.cuid + path.extname(upload.filename)
	const filepath = path.resolve(env.uploadWorkdir, filename)
	await unlink(filepath)

	// Remove upload from database.
	await prisma.upload.delete({
		where: {
			cuid,
		},
	})

	return upload
}
