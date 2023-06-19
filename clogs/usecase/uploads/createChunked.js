const env = require('../../../constants/env')
const prisma = require('../prisma')

/**
 * @param   {number}                                   chunk
 * @param   {string}                                   hash
 * @returns {Promise<import('@prisma/client').Upload>}
 */
module.exports = async (chunk, hash) => {
	if (chunk < 1 || chunk > env.uploadMaxChunks) {
		throw new Error('chunk')
	}

	// Add upload to database.
	const upload = await prisma.upload.create({
		data: {
			count: chunk,
			hash,
		},
	})

	return upload
}
