const validator = require('validator')

const env = require('../../../constants/env')
const { toInternalError } = require('../../utils/errors/toInternalError.js')
const prisma = require('../prisma')
const ValidationError = require('../ValidationError')

const visibilities = ['private', 'public']

/**
 * Create a post by screenname.
 * @param   {number}                        id
 * @param   {object?}                       params
 * @param   {string?}                       params.title
 * @param   {string?}                       params.description
 * @param   {string?}                       params.visibility
 * @returns {Promise<{ updated_at: Date }>}
 */
module.exports = async (id, params) => {
	// Validate params.
	if (typeof id !== 'number' || Number.isNaN(id)) {
		throw new ValidationError('id')
	}
	if (params.title && !validator.isLength(params.title, env.titleLength)) {
		throw new ValidationError('title')
	}
	if (params.description && !validator.isLength(params.description, { max: env.descriptionMaximumLength })) {
		throw new ValidationError('description')
	}
	if (params.visibility && !visibilities.includes(params.visibility)) {
		throw new ValidationError('visibility')
	}

	// Create object to update.
	/**
	 * @type {import('@prisma/client').Post}
	 */
	const data = {
		title: params.title,
		description: params.description,
	}
	if (params.visibility) {
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
	}

	// Add post to database.
	const post = await prisma.post.update({
		select: {
			updatedBy: true,
		},
		data,
		where: {
			id,
		},
	}).catch(toInternalError('notfound', 404))

	// Convert JSON type
	/* eslint-disable camelcase */
	return {
		updated_at: post.updatedBy,
	}
	/* eslint-enable camelcase */
}
