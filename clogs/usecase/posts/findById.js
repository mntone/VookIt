const { toInternalError } = require('../../utils/errors/toInternalError.js')
const prisma = require('../prisma')
const { ValidationError } = require('../ValidationError')

/**
 * Find a post by id.
 * @param   {number}                                      id
 * @param   {object?}                                     options
 * @param   {import('@prisma/client').Prisma.PostSelect?} options.select
 * @returns {Promise<import('@prisma/client').Post?>}
 */
module.exports = async (id, options) => {
	// Validate params.
	if (typeof id !== 'number' || Number.isNaN(id)) {
		throw new ValidationError('id')
	}

	// Find a post by id.
	const post = await prisma.post.findUniqueOrThrow({
		select: options?.select,
		where: {
			id,
		},
	}).catch(toInternalError('notfound', 404))

	return post
}
