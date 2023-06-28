import { VirtualInput } from './VirtualInput'

export class VirtualSelect extends VirtualInput {
	/**
	 * @type {number}
	 */
	#defaultSelectedIndex

	/**
	 * @type {number}
	 */
	#selectedIndex

	/**
	 * @param {HTMLSelectElement}                              elem
	 * @param {boolean}                                        autoHook
	 * @param {{ [key: string]: ((e: InputEvent) => void)[] }} callbacks
	 */
	constructor(elem, autoHook, callbacks) {
		super(elem, callbacks)
		this.#defaultSelectedIndex = elem.selectedIndex
		this.#selectedIndex = elem.selectedIndex

		if (autoHook) {
			this._hook()
		}
	}

	/**
	 * @param {InputEvent} e
	 */
	_onInput(e) {
		this.#selectedIndex = e.target.selectedIndex
		super._onInput(e)
	}

	/**
	 * @type {number}
	 */
	get selectedIndex() {
		return this.#selectedIndex
	}
	/**
	 * @type {number}
	 */
	set selectedIndex(value) {
		if (this.#selectedIndex !== value) {
			this.#selectedIndex = value
			this.#applySelectedIndex(value)
		}
	}

	#applySelectedIndex(index) {
		this.element.selectedIndex = index
	}

	get isDirty() {
		return this.#selectedIndex !== this.#defaultSelectedIndex
	}
}
