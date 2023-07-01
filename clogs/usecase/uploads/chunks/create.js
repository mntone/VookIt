const { mkdir } = require('fs/promises')
const { join } = require('path')

const env = require('../../../../constants/env')
const InternalError = require('../../InternalError')
const prisma = require('../../prisma')
const { isHashData } = require('../../utils/file')
const ValidationError = require('../../ValidationError')
const { getPreferredFilename } = require('../utils')

/**
 * @param   {string}                                        filename
 * @param   {number}                                        filesize
 * @param   {string}                                        filehash
 * @param   {object}                                        options
 * @param   {import('@prisma/client').Prisma.UploadSelect?} options.select
 * @returns {Promise<import('@prisma/client').Upload>}
 */
module.exports = async (filename, filesize, filehash, options) => {
	if (filesize > env.uploadMaxSize) {
		throw ValidationError('filesize')
	}
	if (!isHashData(filehash)) {
		throw ValidationError('filehash')
	}

	// Add upload to database.
	const upload = await prisma.upload.create({
		select: options.select,
		data: {
			filename: getPreferredFilename(filename),
			filesize,
			filehash,
		},
	})

	// Create temporary directory.
	const dirname = join(env.uploadWorkdir, upload.cuid)
	try {
		await mkdir(dirname)
	} catch (err) {
		await prisma.upload.delete({
			select: {},
			where: {
				cuid: upload.cuid,
			},
		})
		throw new InternalError('upload.internal', 500, err)
	}

	return upload
}
