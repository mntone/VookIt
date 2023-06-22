const createError = require('http-errors')

const { toIdAsNumber } = require('../../utils/IdSupport')
const scheme = require('../schemas/view/:id')
const findPostById = require('../usecase/posts/findById')
const ViewPage = require('../views/pages/ViewPage')

const ViewBuilder = require('./utils/ViewBuilder')

/**
 * Define selection
 * @type {import('@prisma/client').Prisma.PostSelect}
 */
const select = {
	title: true,
	description: true,
	postedBy: true,
	published: true,
	publishedBy: true,
	updatedBy: true,
}

class ViewPageBuilder extends ViewBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	async _onNext(req, res, next) {
		const usid = req.params.id
		const id = toIdAsNumber(usid)
		const post = await findPostById(id, { select })
		if (post === null) {
			const err = createError(404, 'error.notfound')
			next(err)
		} else {
			const requestModifiedAtString = req.get('If-Modified-Since')
			if (requestModifiedAtString) {
				const requestModifiedAt = Date.parse(requestModifiedAtString) / 1000
				if (!Number.isNaN(requestModifiedAt) && (post.updatedBy / 1000 | 0) === requestModifiedAt) {
					res.sendStatus(304)
					return
				}
			}

			res.set('Last-Modified', post.updatedBy.toUTCString())
			this.render(res, ViewPage, {
				t: req.t,
				language: req.language,
				id,
				...post,
			})
		}
	}

	get _scheme() {
		return scheme
	}
}

module.exports = new ViewPageBuilder()
