const { createElement } = require('react')

const findUploadByUuid = require('../usecase/uploads/findByUuid')
const { renderToStream } = require('../utils/react/ReactServerSupport')
const PostPage = require('../views/pages/PostPage')

/**
 * @param {string}                     uuid
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
module.exports = async (uuid, req, res) => {
	const upload = await findUploadByUuid(uuid)
	const comp = createElement(PostPage, {
		t: req.t,
		language: req.language,
		...upload,
	})
	renderToStream(comp, res)
}
