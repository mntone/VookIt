const { toIdAsNumber } = require('../../utils/IdSupport')
const scheme = require('../schemas/view/:id')
const findPostById = require('../usecase/posts/findById')
const ViewPage = require('../views/pages/ViewPage')

const ViewBuilder = require('./utils/ViewBuilder')

class ViewPageBuilder extends ViewBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async onNext(req, res) {
		const id = toIdAsNumber(req.params.id)
		const post = await findPostById(id)
		this.render(res, ViewPage, {
			t: req.t,
			language: req.language,
			...post,
		})
	}

	get scheme() {
		return scheme
	}
}

module.exports = new ViewPageBuilder()
