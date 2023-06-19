const prisma = require('../prisma')

/**
 * Find a post by id.
 * @param   {number}                                 id
 * @returns {Promise<import('@prisma/client').Post>}
 */
module.exports = async id => {
	// Validate params.
	if (typeof id !== 'number' || Number.isNaN(id)) {
		throw new Error('id')
	}

	// Find a post by id.
	const post = await prisma.post.findUnique({
		where: {
			id,
		},
	})

	return post
}
