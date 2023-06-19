const { createElement } = require('react')
const { renderToPipeableStream } = require('react-dom/server')

/**
 * @param {import('react').JSX.Element} element
 * @param {object}                      children
 * @param {import('express').Response}  response
 */
function renderToStream(element, children, response) {
	const node = createElement(element, children)
	const { pipe } = renderToPipeableStream(node, {
		onAllReady() {
			response
				.status(200)
				.set({
					'Content-Type': 'text/html; charset=utf-8',
					'X-Content-Type-Options': 'nosniff',
				})
			pipe(response)
		},
		// onShellError() {
		// 	response.sendStatus(500)
		// },
	})
}

module.exports = {
	renderToStream,
}
