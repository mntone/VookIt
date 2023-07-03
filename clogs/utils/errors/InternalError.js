
class InternalError extends Error {
	/**
	 * Field Name
	 * @type {string}
	 */
	#fieldName

	/**
	 * Status Code
	 * @type {number}
	 */
	#statusCode

	constructor(fieldName, statusCode = 400, ...params) {
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

		this.#fieldName = fieldName
		this.#statusCode = statusCode
	}

	/**
	 * Field Name
	 * @type {string}
	 */
	get fieldName() {
		return this.#fieldName
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
