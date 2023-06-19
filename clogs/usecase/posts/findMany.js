const env = require('../../../constants/env')
const prisma = require('../prisma')

/**
 * Get posts.
 * @param   {object?}                                     options
 * @param   {Date?}                                       options.untilDate
 * @param   {number?}                                     options.maxId
 * @param   {number?}                                     options.limit
 * @param   {import('@prisma/client').Prisma.PostSelect?} options.select
 * @returns {Promise<import('@prisma/client').Post[]>}
 */
module.exports = async options => {
	// Validate params.
	if (options && options.limit && options.limit > env.postFetchingLimit) {
		throw new Error('options.limit')
	}

	// Define params.
	const limit = options.limit || 10

	// Get posts.
	/**
	 * @type {import('@prisma/client').Prisma.PostWhereInput|undefined}
	 */
	let where
	if (options) {
		if (options.untilDate != null) {
			where = {
				postedBy: { lte: options.untilDate },
			}
		} else if (options.maxId != null) {
			where = {
				id: { lte: options.maxId },
			}
		} else {
			where = undefined
		}
	} else {
		where = undefined
	}

	const posts = await prisma.post.findMany({
		select: options.select,
		where,
		orderBy: {
			postedBy: 'desc',
		},
		take: limit,
	})

	return posts
}
