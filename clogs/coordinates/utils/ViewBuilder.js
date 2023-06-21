const { renderToStream } = require('./ReactServerSupport')
const ResponseBuilder = require('./ResponseBuilder')

class ViewBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Response}  response
	 * @param {import('react').JSX.Element} element
	 * @param {object}                      children
	 */
	render(response, element, children) {
		renderToStream(element, children, response)
	}
}

module.exports = ViewBuilder
