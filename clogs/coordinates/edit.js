const createError = require('http-errors')

const scheme = require('../schemas/edit')
const findPostById = require('../usecase/posts/findById')
const { toIdAsNumber } = require('../utils/IdSupport')
const EditPage = require('../views/pages/EditPage')

const ViewBuilder = require('./utils/ViewBuilder')

/**
 * Define selection
 * @type {import('@prisma/client').Prisma.PostSelect}
 */
const select = {
	title: true,
	description: true,
	published: true,
}

class EditPageBuilder extends ViewBuilder {
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
			this.render(res, EditPage, {
				t: req.t,
				language: req.language,
				post: {
					id,
					...post,
				},
			}, res)
		}
	}

	get _scheme() {
		return scheme
	}
}

module.exports = new EditPageBuilder()
