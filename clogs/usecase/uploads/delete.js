const fs = require('fs')
const path = require('path')

const validator = require('validator')

const env = require('../../../constants/env')
const prisma = require('../prisma')

/**
 * @param   {string}                          uuid
 * @returns {import('@prisma/client').Upload}
 */
module.exports = async uuid => {
	// Validate params.
	if (!validator.isUUID(uuid)) {
		throw new Error('uuid')
	}

	// Remove upload from database.
	const upload = await prisma.upload.delete({
		where: {
			uuid,
		},
	})

	// Delete temporary upload file.
	const filename = upload.uuid + path.extname(upload.filename)
	const filepath = path.resolve(process.cwd(), env.uploadWorkdir, filename)
	fs.unlink(filepath, err => {
		// [TODO] log
		if (err) {
			console.log(err)
		}
	})

	return upload
}
