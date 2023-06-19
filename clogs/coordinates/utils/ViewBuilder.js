const { checkSchema, validationResult } = require('express-validator')
const createError = require('http-errors')

const { renderToStream } = require('./ReactServerSupport')

class ViewBuilder {
	/**
	 * @param {import('express').Response}  response
	 * @param {import('react').JSX.Element} element
	 * @param {object}                      children
	 */
	render(response, element, children) {
		renderToStream(element, children, response)
	}

	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	onNext(req, res, next) {
		next()
	}

	/**
	 * @param {import('express-validator').Result<import('express-validator').ValidationError>} ret
	 * @param {import('express').Request}                                                       req
	 * @param {import('express').Response}                                                      res
	 * @param {import('express').NextFunction}                                                  next
	 */
	onValidationError(ret, req, res, next) {
		const err = createError(422, ret.array())
		next(err)
	}

	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	#onNext(req, res, next) {
		const ret = validationResult(req)
		if (!ret.isEmpty()) {
			this.onValidationError(ret, req, res, next)
		} else {
			this.onNext(req, res, next)
		}
	}

	/**
	 * @type {import('express-validator').Schema}
	 */
	get scheme() {
		throw Error('This property must be overridden.')
	}

	get handlers() {
		return [
			checkSchema(this.scheme),
			this.#onNext.bind(this),
		]
	}
}

module.exports = ViewBuilder
