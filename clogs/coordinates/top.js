const env = require('../../constants/env')
const scheme = require('../schemas/top')
const findPosts = require('../usecase/posts/findMany')
const TopPage = require('../views/pages/TopPage')

const ViewBuilder = require('./utils/ViewBuilder')

/**
 * Define selection
 * @type {import('@prisma/client').Prisma.PostSelect}
 */
const select = {
	id: true,
	title: true,
	postedBy: true,
}

class TopPageBuilder extends ViewBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async _onNext(req, res) {
		const limit = env.topMaxCount + 1
		const options = { select, limit }
		if (req.query.until) {
			options.untilDate = new Date(Number(req.query.until))
		}

		const posts = await findPosts(options)
		this.render(res, TopPage, {
			t: req.t,
			language: req.language,
			limit,
			posts,
		}, res)
	}

	get _scheme() {
		return scheme
	}
}

module.exports = new TopPageBuilder()
