const scheme = require('../schemas/post')
const findUploadByUuid = require('../usecase/uploads/findByUuid')
const PostPage = require('../views/pages/PostPage')

const ViewBuilder = require('./utils/ViewBuilder')

class PostPageBuilder extends ViewBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async onNext(req, res) {
		const uuid = req.params.uuid
		const upload = await findUploadByUuid(uuid)
		this.render(res, PostPage, {
			t: req.t,
			language: req.language,
			...upload,
		}, res)
	}

	get scheme() {
		return scheme
	}
}

module.exports = new PostPageBuilder()
