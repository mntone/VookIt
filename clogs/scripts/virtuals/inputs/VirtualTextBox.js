import { VirtualInput } from './VirtualInput'

export class VirtualTextBox extends VirtualInput {
	/**
	 * @type {string?}
	 */
	#text

	/**
	 * @param {HTMLInputElement}                               elem
	 * @param {boolean}                                        autoHook
	 * @param {{ [key: string]: ((e: InputEvent) => void)[] }} callbacks
	 */
	constructor(elem, autoHook, callbacks) {
		super(elem, callbacks)
		this.#text = elem.value

		if (autoHook) {
			this._hook()
		}
	}

	/**
	 * @param {InputEvent} e
	 */
	_onInput(e) {
		this.#text = e.target.value
		super._onInput(e)
	}

	/**
	 * @type {string}
	 */
	get text() {
		return this.#text
	}
	/**
	 * @type {string}
	 */
	set text(value) {
		if (this.#text !== value) {
			this.#text = value
			this.#applyText(value)
		}
	}

	#applyText(text) {
		this.element.value = text
	}

	get isDirty() {
		return this.#text !== this.element.defaultValue
	}
}
