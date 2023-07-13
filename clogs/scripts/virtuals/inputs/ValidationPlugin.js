
/**
 * @typedef ValidationOptions
 * @property {string}        c
 * @property {string | null} messageElementId
 * @property {object}        m
 * @property {string}        m.l
 */

export class ValidationPlugin {
	/**
	 * @type {Omit<ValidationOptions, 'messageElementId'>}
	 */
	#options

	/**
	 * @type {HTMLElement | null}
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
		if (options.messageElementId) {
			this.#messageElement = document.getElementById(options.messageElementId)
			delete options.messageElementId
		} else {
			this.#messageElement = null
		}

		// Save ValidationOptions
		this.#options = Object.freeze(options)
	}

	/**
	 * @param {import('./VirtualCallbackElement').VirtualCallbackElement} parent
	 */
	connect(parent) {
		parent.on('input', this._onInput.bind(this))
		parent.elem.addEventListener('invalid', this._onInvalid.bind(this))

		if (parent.elem.minLength > 0) {
			this.#minimumLength = parent.elem.minLength
			if (this.#minimumLength) {
				parent.elem.removeAttribute('minlength')
			}
			if (parent.elem.required) {
				if (this.#minimumLength === 0) {
					this.#minimumLength = 1
				}
				parent.elem.removeAttribute('required')
			}
		}
		if (parent.elem.maxLength > 0) {
			this.#maximumLength = parent.elem.maxLength
			parent.elem.removeAttribute('maxlength')
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
			message = this.#options.m.l
		} else if (this.#minimumLength !== -1 && length < this.#minimumLength) {
			message = this.#options.m.l
		}
		e.target.setCustomValidity(message)

		if (e.target.reportValidity()) {
			if (this.#messageElement) {
				this.#messageElement.textContent = ''
			}
			e.target.classList.remove(this.#options.c)
		}
	}

	/**
	 * @param {Event} e
	 */
	_onInvalid(e) {
		if (this.#messageElement) {
			this.#messageElement.textContent = e.target.validationMessage
		}
		e.target.classList.add(this.#options.c)
		e.preventDefault()
	}
}
