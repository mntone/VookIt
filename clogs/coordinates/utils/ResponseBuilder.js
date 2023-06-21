const { checkSchema, validationResult } = require('express-validator')
const createError = require('http-errors')

const ValidationError = require('../../usecase/ValidationError')

class ResponseBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	_onNext(req, res, next) {
		next()
	}

	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	#onNext(req, res, next) {
		const ret = validationResult(req)
		if (!ret.isEmpty()) {
			this._onValidationError(ret, req, res, next)
		} else {
			try {
				this._onNext(req, res, next)
			} catch (err) {
				if (err instanceof ValidationError) {
					const err = createError(404, 'error.' + err.paramName)
					next(err)
				} else {
					next(err)
				}
			}
		}
	}

	/**
	 * @param {import('express-validator').Result<import('express-validator').ValidationError>} ret
	 * @param {import('express').Request}                                                       req
	 * @param {import('express').Response}                                                      res
	 * @param {import('express').NextFunction}                                                  next
	 */
	_onValidationError(ret, req, res, next) {
		const err = createError(422, 'error.' + ret.array({ onlyFirstError: true })[0].path)
		next(err)
	}

	/**
	 * @type {import('express-validator').Schema}
	 */
	get _scheme() {
		throw Error('This property must be overridden.')
	}

	get handlers() {
		return [
			checkSchema(this._scheme),
			this.#onNext.bind(this),
		]
	}
}

module.exports = ResponseBuilder
