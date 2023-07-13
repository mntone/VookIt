import { VirtualCallbackElement } from './VirtualCallbackElement'

export class VirtualInput extends VirtualCallbackElement {
	/**
	 * @type {boolean}
	 */
	#hooked = false

	/**
	 * @param {HTMLInputElement}                               elem
	 * @param {boolean}                                        autoHook
	 * @param {{ [key: string]: ((e: InputEvent) => void)[] }} callbacks
	 */
	constructor(elem, autoHook, callbacks) {
		super(elem, callbacks)
		this.#hooked = false

		if (autoHook) {
			this.#hook()
		}
	}

	hookIfNeeded() {
		if (!this.#hooked) {
			this.#hook()
		}
	}

	#hook() {
		this.#hooked = true
		this.elem.addEventListener('input', this._onInput.bind(this))
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
		return !this.elem.validity.valid
	}

	/**
	 * @type {boolean}
	 */
	get isDirty() {
		throw Error('This property must be overridden.')
	}
}
