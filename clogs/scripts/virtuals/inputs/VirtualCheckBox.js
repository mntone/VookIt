import { VirtualElement } from '../VirtualElement'

export class VirtualCheckBox extends VirtualElement {
	/**
	 * @type {boolean}
	 */
	#defaultChecked

	/**
	 * @type {boolean}
	 */
	#checked

	/**
	 * @type {boolean}
	 */
	#hooked = false

	/**
	 * @param {HTMLInputElement}                               elem
	 * @param {boolean?}                                       checked
	 * @param {boolean}                                        autoHook
	 * @param {{ [key: string]: ((e: InputEvent) => void)[] }} callbacks
	 */
	constructor(elem, checked, autoHook, callbacks) {
		super(elem, callbacks)
		this.#defaultChecked = elem.defaultChecked
		this.#checked = checked

		if (checked != null && elem.checked !== checked) {
			if (!checked && elem.defaultChecked) {
				elem.removeAttribute('checked')
			}
			this.#applyChecked(checked)
		}

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
		this._hooked = true
		this.elem.addEventListener('change', this._onChange.bind(this))
	}

	/**
	 * @param {InputEvent} e
	 */
	_onChange(e) {
		this.#checked = e.target.checked
		this._raise('change', e)
	}

	/**
	 * @type {boolean}
	 */
	get checked() {
		return this.#checked
	}
	/**
	 * @type {boolean}
	 */
	set checked(value) {
		if (this.#checked !== value) {
			this.#checked = value
			this.#applyChecked(value)
		}
	}

	#applyChecked(checked) {
		this.elem.checked = checked
	}

	get isDirty() {
		return this.#checked !== this.#defaultChecked
	}
}
