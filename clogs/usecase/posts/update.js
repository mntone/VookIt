const validator = require('validator')

const env = require('../../../constants/env')
const prisma = require('../prisma')
const ValidationError = require('../ValidationError')

/**
 * Create a post by screenname.
 * @param   {number}                                 id
 * @param   {string?}                                title
 * @param   {string?}                                description
 * @returns {Promise<import('@prisma/client').Post>}
 */
module.exports = async (id, title, description) => {
	// Validate params.
	if (typeof id !== 'number' || Number.isNaN(id)) {
		throw ValidationError('id')
	}
	if (title && !validator.isLength(title, env.titleLength)) {
		throw ValidationError('title')
	}
	if (description && !validator.isLength(description, env.descriptionLength)) {
		throw ValidationError('description')
	}

	// Add post to database.
	const post = await prisma.post.update({
		select: {
			id: true,
		},
		data: {
			title,
			description,
		},
		where: {
			id,
		},
	})

	return post
}
