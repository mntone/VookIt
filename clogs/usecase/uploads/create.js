const { rename, writeFile } = require('fs/promises')
const path = require('path')

const env = require('../../../constants/env')
const InternalError = require('../../utils/errors/InternalError')
const { numToUsid } = require('../../utils/IdSupport')
const prisma = require('../prisma')
const { compareBlobHash } = require('../utils/file')

const mainQueue = require('./bull')
const { getOrCreateUploadPath, errors, getPreferredFilename } = require('./utils')

/**
 * Create upload from temporary file.
 * @param   {string}                                                           hashdata
 * @param   {import('../../utils/interceptors/file.interceptor.mjs').FileData} file
 * @param   {string}                                                           screenname
 * @returns {Promise<{ usid: string, posted_at: Date, author_id: number }>}
 */
module.exports = async (hashdata, file, screenname) => {
	// Compare file hash
	await compareBlobHash(file.buffer, hashdata)

	// Add post to database.
	const ext = path.extname(file.filename)
	const post = await prisma.post.create({
		data: {
			title: '?'.repeat(env.titleLength.min),
			filename: getPreferredFilename(file.filename, ext),
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

	// Move files from temporary.
	try {
		const dstpath = await getOrCreateUploadPath(post.id, ext)
		await writeFile(dstpath, file.buffer, 'binary')
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
