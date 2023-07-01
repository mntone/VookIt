const { existsSync, createWriteStream } = require('fs')
const { rm } = require('fs/promises')
const { join, extname } = require('path')

const env = require('../../../../constants/env')
const { numToUsid } = require('../../../utils/IdSupport')
const isCUID = require('../../../utils/isCUID')
const InternalError = require('../../InternalError')
const prisma = require('../../prisma')
const { getReaderStreamAsPromise, compareFileHash } = require('../../utils/file')
const toInternalErrorOf = require('../../utils/toInternalErrorOf')
const ValidationError = require('../../ValidationError')
const mainQueue = require('../bull')
const { existsTemporaryUploadDir, getOrCreateUploadPath, errors } = require('../utils')

/**
 * @param {string} cuid
 * @param {string} screenname
 */
module.exports = async (cuid, screenname) => {
	// Validate params.
	if (!isCUID(cuid)) {
		throw ValidationError('cuid')
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
	}).catch(toInternalErrorOf('upload.notfound', 404))

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

		// Remove temporary files.
		await rm(dirname, { force: true, recursive: true, maxRetries: 2 })
	} catch (err) {
		if (err instanceof InternalError && err.errorName === errors.internal) {
			await prisma.post.delete({
				select: {},
				where: {
					id: post.id,
				},
			})
			throw new InternalError('upload.failed')
		}
		throw err
	}

	// Dispatch encoding.
	const usid = numToUsid(post.id)
	mainQueue.add(`encode-${usid}`, {
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
