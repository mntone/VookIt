const validator = require('validator')

const env = require('../../../constants/env')
const prisma = require('../prisma')
const ValidationError = require('../ValidationError')

const visibilities = ['private', 'public']

/**
 * Create a post by screenname.
 * @param   {number}                                 id
 * @param   {object}                                 params
 * @param   {string?}                                params.title
 * @param   {string?}                                params.description
 * @param   {string?}                                params.visibility
 * @returns {Promise<import('@prisma/client').Post>}
 */
module.exports = async (id, params) => {
	// Validate params.
	if (typeof id !== 'number' || Number.isNaN(id)) {
		throw ValidationError('id')
	}
	if (params.title && !validator.isLength(params.title, env.titleLength)) {
		throw ValidationError('title')
	}
	if (params.description && !validator.isLength(params.description, env.descriptionLength)) {
		throw ValidationError('description')
	}
	if (params.visibility && !visibilities.includes(params.visibility)) {
		throw ValidationError('visibility')
	}

	// Create object to update.
	/**
	 * @type {import('@prisma/client').Post}
	 */
	const data = {
		title: params.title,
		description: params.description,
	}
	if (params.visibility === 'public') {
		const currentPost = await prisma.post.findUniqueOrThrow({
			select: {
				published: true,
				publishedBy: true,
			},
			where: {
				id,
			},
		})
		if (!currentPost.published) {
			data.published = true
			if (!currentPost.publishedBy) {
				data.publishedBy = new Date()
			}
		}
	} else {
		data.published = false
	}

	// Add post to database.
	const post = await prisma.post.update({
		select: {
			id: true,
		},
		data,
		where: {
			id,
		},
	})

	return post
}
