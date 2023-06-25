const { mkdir, rename } = require('fs/promises')
const path = require('path')

const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const env = require('../../../constants/env')
const { numToUsid } = require('../../../utils/IdSupport')
const prisma = require('../prisma')

const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
const queue = new Queue(env.hawksInitTaskQueueName, { connection })

/**
 * Create upload from temporary file.
 * @param                                            tempfile
 * @param   {string}                                 screenname
 * @returns {Promise<import('@prisma/client').Post>}
 */
module.exports = async (tempfile, screenname) => {
	const ext = path.extname(tempfile.originalFilename)

	let savedFilename
	if (env.uploadDeleteOriginalFilename) {
		savedFilename = 'video' + ext
	} else {
		savedFilename = tempfile.originalFilename
	}

	// Add post to database.
	const post = await prisma.post.create({
		data: {
			title: '?'.repeat(env.titleLength.min),
			filename: savedFilename,
			author: {
				connect: { screenname: screenname },
			},
		},
		select: {
			id: true,
			postedBy: true,
			authorId: true,
		},
	})

	// Create directory
	const usid = numToUsid(post.id)
	const dstpath = env.mediaOriginalFile
		.replace('[id]', usid)
		.replace('[ext]', ext)
	const dstdir = path.dirname(dstpath)
	try {
		await mkdir(dstdir, { recursive: true })
	} catch (err) {
		await prisma.post.delete({
			select: {},
			where: {
				id: post.id,
			},
		})
		return null
	}

	// Move files from temporary.
	await rename(tempfile.path, dstpath)

	// Dispatch encoding.
	queue.add('encode:auto', {
		id: usid,
		ext: path.extname(dstpath),
		cursor: -1,
		phase: 'pending',
	})

	return post
}
