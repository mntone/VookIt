const createError = require('http-errors')

const { toIdAsNumber } = require('../../utils/IdSupport')
const scheme = require('../schemas/view/:id')
const findPostById = require('../usecase/posts/findById')
const ViewPage = require('../views/pages/ViewPage')

const ViewBuilder = require('./utils/ViewBuilder')

class ViewPageBuilder extends ViewBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	async _onNext(req, res, next) {
		const usid = req.params.id
		const id = toIdAsNumber(usid)
		const post = await findPostById(id)
		if (post === null) {
			const err = createError(404, 'error.notfound')
			next(err)
		} else {
			this.render(res, ViewPage, {
				t: req.t,
				language: req.language,
				...post,
			})
		}
	}

	get _scheme() {
		return scheme
	}
}

module.exports = new ViewPageBuilder()
