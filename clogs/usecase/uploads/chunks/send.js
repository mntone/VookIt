const { rename } = require('fs/promises')
const { join } = require('path')

const env = require('../../../../constants/env')
const { toInternalError } = require('../../../utils/errors/toInternalError')
const isCUID = require('../../../utils/isCUID')
const prisma = require('../../prisma')
const { compareFileHash } = require('../../utils/file')
const ValidationError = require('../../ValidationError')
const { existsTemporaryUploadDir } = require('../utils')

/**
 * @param {string} cuid
 * @param {number} index
 * @param          hashdata
 * @param          file
 */
module.exports = async (cuid, index, hashdata, file) => {
	// Validate params.
	if (!isCUID(cuid)) {
		throw ValidationError('cuid')
	}

	// Exist temporary directory.
	const dirname = existsTemporaryUploadDir(cuid)

	// Compare file hash
	await compareFileHash(file.path, hashdata)

	// Find a upload by cuid.
	const upload = await prisma.upload.findUniqueOrThrow({
		select: {
			filesize: true,
		},
		where: {
			cuid,
		},
	}).catch(toInternalError('upload.notfound', 404))

	// Validate additional params.
	const chunks = Math.ceil(upload.filesize / env.uploadMaxChunkSize)
	if (index > chunks) {
		throw ValidationError('index')
	}

	// Move files from temporary.
	const dirpath = join(dirname, index.toString())
	await rename(file.path, dirpath)
}
