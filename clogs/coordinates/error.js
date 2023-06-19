const ErrorPage = require('../views/pages/ErrorPage')

const { renderToStream } = require('./utils/ReactServerSupport')

/**
 * @param {string}                     description
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
module.exports = async (description, req, res) => {
	renderToStream(ErrorPage, {
		t: req.t,
		language: req.language,
		description,
	}, res)
}
