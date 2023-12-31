const { writeFile } = require('fs/promises')
const { join } = require('path')

const env = require('../../../../constants/env')
const { toInternalError } = require('../../../utils/errors/toInternalError')
const isCUID = require('../../../utils/validators/isCUID')
const prisma = require('../../prisma')
const { compareBlobHash } = require('../../utils/file')
const ValidationError = require('../../ValidationError')
const { existsTemporaryUploadDir } = require('../utils')

/**
 * @param {string}                                                              cuid
 * @param {number}                                                              index
 * @param                                                                       hashdata
 * @param {import('../../../utils/interceptors/file.interceptor.mjs').FileData} file
 */
module.exports = async (cuid, index, hashdata, file) => {
	// Validate params.
	if (!isCUID(cuid)) {
		throw new ValidationError('cuid')
	}

	// Exist temporary directory.
	const dirname = existsTemporaryUploadDir(cuid)

	// Compare file hash
	await compareBlobHash(file.buffer, hashdata)

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
		throw new ValidationError('index')
	}

	// Save a file from temporary.
	const dirpath = join(dirname, index.toString())
	await writeFile(dirpath, file.buffer, 'binary')
}
