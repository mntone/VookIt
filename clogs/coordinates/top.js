const { createElement } = require('react')

const env = require('../../constants/env')
const findPosts = require('../usecase/posts/findMany')
const { renderToStream } = require('../utils/react/ReactServerSupport')
const TopPage = require('../views/pages/TopPage')

/**
 * Define selection
 * @type {import('@prisma/client').Prisma.PostSelect}
 */
const select = {
	id: true,
	title: true,
	postedBy: true,
}

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {object}                     options
 * @param {Date?}                      options.untilDate
 */
module.exports = async (req, res, options) => {
	const limit = env.topMaxCount + 1
	const posts = await findPosts({ select, limit, ...options })
	const comp = createElement(TopPage, {
		t: req.t,
		language: req.language,
		limit,
		posts,
	})
	renderToStream(comp, res)
}
