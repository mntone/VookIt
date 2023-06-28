
/**
 * @typedef ValidationOptions
 * @property {string} invalidClassName
 * @property {string} messageElementId
 * @property {string} validationMessage
 */

export class ValidationPlugin {
	/**
	 * @type {ValidationOptions}
	 */
	#options

	/**
	 * @type {HTMLElement}
	 */
	#messageElement

	/**
	 * @type {number}
	 */
	#minimumLength = -1

	/**
	 * @type {number}
	 */
	#maximumLength = -1

	/**
	 * @param {ValidationOptions} options
	 */
	constructor(options) {
		this.#messageElement = document.getElementById(options.messageElementId)

		// Save ValidationOptions
		delete options.messageElementId
		this.#options = Object.freeze(options)
	}

	/**
	 * @param {import('./VirtualCallbackElement').VirtualCallbackElement} parent
	 */
	connect(parent) {
		parent.on('input', this._onInput.bind(this))
		parent.element.addEventListener('invalid', this._onInvalid.bind(this))

		if (parent.element.minLength > 0) {
			this.#minimumLength = parent.element.minLength
			if (this.#minimumLength) {
				parent.element.removeAttribute('minlength')
			}
			if (parent.element.required) {
				if (this.#minimumLength === 0) {
					this.#minimumLength = 1
				}
				parent.element.removeAttribute('required')
			}
		}
		if (parent.element.maxLength > 0) {
			this.#maximumLength = parent.element.maxLength
			parent.element.removeAttribute('maxlength')
		}
	}

	/**
	 * @param {InputEvent} e
	 */
	_onInput(e) {
		const str = e.target.value
		const presentationSequences = str.match(/(?:\uFE0F|\uFE0E)/g) || []
		const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []
		const length = str.length - presentationSequences.length - surrogatePairs.length

		let message = ''
		if (this.#maximumLength !== -1 && length > this.#maximumLength) {
			message = this.#options.validationMessage
		} else if (length < this.#minimumLength && length !== 0) {
			message = this.#options.validationMessage
		}
		e.target.setCustomValidity(message)

		if (e.target.reportValidity()) {
			this.#messageElement.textContent = ''
			e.target.classList.remove(this.#options.invalidClassName)
		}
	}

	/**
	 * @param {Event} e
	 */
	_onInvalid(e) {
		this.#messageElement.textContent = e.target.validationMessage
		e.target.classList.add(this.#options.invalidClassName)
		e.preventDefault()
	}
}
