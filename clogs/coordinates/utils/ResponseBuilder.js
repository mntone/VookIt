const { checkSchema, validationResult } = require('express-validator')
const createError = require('http-errors')

const InternalError = require('../../usecase/InternalError')
const ValidationError = require('../../usecase/ValidationError')

class ResponseBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	async _onNext(req, res, next) {
		next()
	}

	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	async #onNext(req, res, next) {
		const ret = validationResult(req)
		if (!ret.isEmpty()) {
			this._onValidationError(ret, req, res, next)
		} else {
			try {
				await this._onNext(req, res, next)
			} catch (err) {
				if (err instanceof ValidationError) {
					const key = 'error.' + err.paramName
					const newErr = createError(400, req.t(key))
					next(newErr)
				} else if (err instanceof InternalError) {
					const key = 'error.' + err.errorName
					const newErr = createError(err.statusCode, req.t(key))
					next(newErr)
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
		const key = 'error.' + ret.array({ onlyFirstError: true })[0].path
		const err = createError(400, req.t(key))
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
