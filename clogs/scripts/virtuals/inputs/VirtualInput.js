import { VirtualCallbackElement } from './VirtualCallbackElement'

export class VirtualInput extends VirtualCallbackElement {
	/**
	 * @type {boolean}
	 */
	#hooked = false

	/**
	 * @param {HTMLInputElement}                               elem
	 * @param {{ [key: string]: ((e: InputEvent) => void)[] }} callbacks
	 */
	constructor(elem, callbacks) {
		super(elem, callbacks)
		this.#hooked = false
	}

	hookIfNeeded() {
		if (!this.#hooked) {
			this._hook()
		}
	}

	_hook() {
		this.#hooked = true
		this.element.addEventListener('input', this._onInput.bind(this))
	}

	/**
	 * @param {InputEvent} e
	 */
	_onInput(e) {
		this._raise('input', e)
	}

	/**
	 * @type {boolean}
	 */
	get hasError() {
		return !this.element.validity.valid
	}

	/**
	 * @type {boolean}
	 */
	get isDirty() {
		throw Error('This property must be overridden.')
	}
}
