const UploadPage = require('../views/pages/UploadPage')

const { renderToStream } = require('./utils/ReactServerSupport')

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
module.exports = async (req, res) => {
	renderToStream(UploadPage, {
		t: req.t,
		language: req.language,
	}, res)
}
