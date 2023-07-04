const { existsSync, createWriteStream } = require('fs')
const { rm } = require('fs/promises')
const { join, extname } = require('path')

const env = require('../../../../constants/env')
const InternalError = require('../../../utils/errors/InternalError')
const { toInternalError } = require('../../../utils/errors/toInternalError')
const { numToUsid } = require('../../../utils/IdSupport')
const isCUID = require('../../../utils/isCUID')
const prisma = require('../../prisma')
const { getReaderStreamAsPromise, compareFileHash } = require('../../utils/file')
const ValidationError = require('../../ValidationError')
const mainQueue = require('../bull')
const { existsTemporaryUploadDir, getOrCreateUploadPath, errors } = require('../utils')

/**
 * @param   {string}                                                        cuid
 * @param   {string}                                                        screenname
 * @returns {Promise<{ usid: string, posted_at: Date, author_id: number }>}
 */
module.exports = async (cuid, screenname) => {
	// Validate params.
	if (!isCUID(cuid)) {
		throw new ValidationError('cuid')
	}

	// Exist temporary directory.
	const dirname = existsTemporaryUploadDir(cuid)

	// Find a upload by cuid.
	const upload = await prisma.upload.findUniqueOrThrow({
		select: {
			filename: true,
			filesize: true,
			filehash: true,
		},
		where: {
			cuid,
		},
	}).catch(toInternalError('upload.notfound', 404))

	// Exist all chunks.
	const chunks = Math.ceil(upload.filesize / env.uploadMaxChunkSize)
	const lacks = []
	for (let i = 0; i < chunks; ++i) {
		const chunkPath = join(dirname, i.toString())
		if (!existsSync(chunkPath)) {
			lacks.push(i)
		}
	}
	if (lacks.length !== 0) {
		return lacks
	}

	// Add post to database.
	const post = await prisma.post.create({
		data: {
			title: '?'.repeat(env.titleLength.min),
			filename: upload.filename,
			author: {
				connect: { screenname },
			},
		},
		select: {
			id: true,
			postedBy: true,
			authorId: true,
		},
	})

	// Create upload file.
	const ext = extname(upload.filename)
	try {
		const dstpath = await getOrCreateUploadPath(post.id, ext)
		const ws = createWriteStream(dstpath)
		for (let i = 0; i < chunks; ++i) {
			const chunkPath = join(dirname, i.toString())
			await getReaderStreamAsPromise(chunkPath, rs => rs.pipe(ws, { end: false }))
		}

		// Compare file hash
		await compareFileHash(dstpath, upload.filehash)
	} catch (err) {
		if (err instanceof InternalError && err.errorName === errors.internal) {
			await prisma.post.delete({
				select: {
					id: true,
				},
				where: {
					id: post.id,
				},
			})
			throw new InternalError('upload.failed')
		}
		throw err
	}

	try {
		// Remove temporary files.
		await rm(dirname, { force: true, recursive: true, maxRetries: 2 })
	} catch (err) {
		// [TODO] log
	}

	// Dispatch encoding.
	const usid = numToUsid(post.id)
	await mainQueue.add(`encode-${usid}`, {
		id: usid,
		ext,
		cursor: -1,
		phase: 'pending',
	})

	// Convert JSON type
	/* eslint-disable camelcase */
	return {
		usid: numToUsid(post.id),
		posted_at: post.postedBy,
		author_id: post.authorId,
	}
	/* eslint-enable camelcase */
}
