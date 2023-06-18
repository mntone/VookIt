const { createElement } = require('react')

const { renderToStream } = require('../utils/react/ReactServerSupport')
const UploadPage = require('../views/pages/UploadPage')

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
module.exports = async (req, res) => {
	const comp = createElement(UploadPage, {
		t: req.t,
		language: req.language,
	})
	renderToStream(comp, res)
}
