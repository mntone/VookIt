
class InternalError extends Error {
	/**
	 * Error Name
	 * @type {string}
	 */
	#errorName

	/**
	 * Status Code
	 * @type {number}
	 */
	#statusCode

	constructor(errorName, statusCode = 400, ...params) {
		super(params)

		Object.defineProperty(this, 'name', {
			configurable: true,
			enumerable: false,
			value: this.constructor.name,
			writable: true,
		})

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InternalError)
		}

		this.#errorName = errorName
		this.#statusCode = statusCode
	}

	/**
	 * Error Name
	 * @type {string}
	 */
	get errorName() {
		return this.#errorName
	}

	/**
	 * Status Code
	 * @type {number}
	 */
	get statusCode() {
		return this.#statusCode
	}
}

module.exports = InternalError
