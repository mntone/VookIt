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
		throw ValidationError('id')
	}

	// Find a post by id.
	const post = await prisma.post.findUnique({
		select: options?.select,
		where: {
			id,
		},
	})

	return post
}
