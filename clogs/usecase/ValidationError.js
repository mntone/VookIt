
class ValidationError extends Error {
	/**
	 * Parameter Name
	 * @type {string}
	 */
	#paramName

	constructor(paramName) {
		super(`${paramName} has an invalid value.`)

		this.#paramName = paramName
	}

	/**
	 * Parameter Name
	 * @type {string}
	 */
	get paramName() {
		return this.#paramName
	}

	static {
		this.prototype.name = 'ValidationError'
	}
}

module.exports = ValidationError
