const { createElement } = require('react')

const { renderToStream } = require('../utils/react/ReactServerSupport')
const ErrorPage = require('../views/pages/ErrorPage')

/**
 * @param {string}                     description
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
module.exports = async (description, req, res) => {
	const comp = createElement(ErrorPage, {
		t: req.t,
		language: req.language,
		description,
	})
	renderToStream(comp, res)
}
