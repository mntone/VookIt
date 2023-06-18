const { createElement } = require('react')

const findPostById = require('../usecase/posts/findById')
const { renderToStream } = require('../utils/react/ReactServerSupport')
const ViewPage = require('../views/pages/ViewPage')

/**
 * @param {string}                     id
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
module.exports = async (id, req, res) => {
	const nmid = Number(id) // [TODO] base64 decoding
	const post = await findPostById(nmid)
	const comp = createElement(ViewPage, {
		t: req.t,
		language: req.language,
		...post,
	})
	renderToStream(comp, res)
}
