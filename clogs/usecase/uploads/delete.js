const fs = require('fs')
const path = require('path')

const { PrismaClient } = require('@prisma/client')
const validator = require('validator')

const env = require('../../../constants/env')

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
	const prisma = new PrismaClient()
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
