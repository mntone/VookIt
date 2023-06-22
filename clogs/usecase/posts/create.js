const fs = require('fs')
const path = require('path')

const validator = require('validator')

const env = require('../../../constants/env')
const { mkdirIfNeeded } = require('../../../utils/FileSupport')
const { numToUsid } = require('../../../utils/IdSupport')
const prisma = require('../prisma')
const ValidationError = require('../ValidationError')

/**
 * Create a post by screenname.
 * @param   {string}                                 uuid
 * @param   {string}                                 screenname
 * @param   {string}                                 title
 * @param   {string?}                                description
 * @returns {Promise<import('@prisma/client').Post>}
 */
module.exports = async (uuid, screenname, title, description) => {
	// Validate params.
	if (!validator.isUUID(uuid)) {
		throw ValidationError('uuid')
	}
	if (!validator.isLength(title, env.titleLength)) {
		throw ValidationError('title')
	}
	if (description && !validator.isLength(description, env.descriptionLength)) {
		throw ValidationError('description')
	}

	// Find a upload by uuid.
	const upload = await prisma.upload.findUnique({
		where: {
			uuid,
		},
	})

	// Add post to database.
	const post = await prisma.post.create({
		data: {
			title,
			description,
			filename: upload.filename,
			author: {
				connect: { screenname: screenname },
			},
		},
		select: {
			id: true,
			postedBy: true,
			published: true,
			publishedBy: true,
		},
	})

	// Move a file from workdir.
	// ex. Move "/.work/upld/[uuid].mp4" to "/media/[strid]/.org.(mp4|webm)"
	const fileext = path.extname(upload.filename)
	const usID = numToUsid(post.id)
	const dstpath = env.mediaOriginalFile
		.replace('[id]', usID)
		.replace('[ext]', fileext)
	const dstdir = path.dirname(dstpath)
	await mkdirIfNeeded(dstdir)

	const srcname = uuid + fileext
	const srcpath = path.join(env.uploadWorkdir, srcname)
	fs.rename(srcpath, dstpath, err => {
		if (err) {
			// [TODO] Remove Post if needed
			throw err
		}
	})

	// Remove upload by uuid.
	await prisma.upload.delete({
		where: {
			uuid,
		},
	})

	// [TODO] Add initial jobs.

	return post
}
