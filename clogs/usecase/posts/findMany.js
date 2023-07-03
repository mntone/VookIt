const env = require('../../../constants/env')
const prisma = require('../prisma')
const ValidationError = require('../ValidationError')

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
	if (options?.limit && options.limit > env.postFetchingLimit) {
		throw new ValidationError('options.limit')
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
				published: { equals: true },
			}
		} else if (options.maxId != null) {
			where = {
				id: { lte: options.maxId },
				published: { equals: true },
			}
		} else {
			where = {
				published: { equals: true },
			}
		}
	} else {
		where = {
			published: { equals: true },
		}
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
