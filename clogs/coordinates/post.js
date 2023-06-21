const createError = require('http-errors')

const scheme = require('../schemas/post')
const findUploadByUuid = require('../usecase/uploads/findByUuid')
const PostPage = require('../views/pages/PostPage')

const ViewBuilder = require('./utils/ViewBuilder')

class PostPageBuilder extends ViewBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	async _onNext(req, res, next) {
		const uuid = req.params.uuid
		const upload = await findUploadByUuid(uuid)
		if (upload === null) {
			const err = createError(404, 'error.notfound')
			next(err)
		} else {
			this.render(res, PostPage, {
				t: req.t,
				language: req.language,
				...upload,
			}, res)
		}
	}

	get _scheme() {
		return scheme
	}
}

module.exports = new PostPageBuilder()
