const { renderToPipeableStream } = require('react-dom/server')

/**
 * @param {import('react').ReactNode}  children
 * @param {import('express').Response} response
 */
function renderToStream(children, response) {
	const pipe = renderToPipeableStream(children, {
		onAllReady() {
			response
				.status(200)
				.set({
					'Content-Type': 'text/html; charset=utf-8',
					'X-Content-Type-Options': 'nosniff',
				})
			pipe.pipe(response)
		},
		// onShellError() {
		// 	response.sendStatus(500)
		// },
	})
}

module.exports = {
	renderToStream,
}
