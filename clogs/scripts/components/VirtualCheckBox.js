export default class VirtualCheckBox {
	/**
	 * @type {HTMLInputElement}
	 */
	#elem

	/**
	 * @type {boolean}
	 */
	#hooked

	/**
	 * @type {boolean}
	 */
	#checked

	/**
	 * @param {HTMLInputElement} elem
	 * @param {boolean}          autoHook
	 * @param {boolean?}         checked
	 */
	constructor(elem, autoHook, checked) {
		this.#elem = elem
		this.#hooked = false
		this.#checked = elem.checked

		if (checked != null && elem.checked !== checked) {
			if (!checked) {
				elem.removeAttribute('checked')
			}
			this.#applyDOM(checked)
		}

		if (autoHook) {
			this.hookChange()
		}
	}

	hookChange() {
		if (this.#hooked) {
			return
		}
		this.#hooked = true
		this.#elem.addEventListener('change', this._onChange.bind(this))
	}

	_onChange(e) {
		this.#checked = e.target.checked
	}

	#applyDOM(checked) {
		this.#elem.checked = checked
	}

	get checked() {
		return this.#checked
	}
	set checked(value) {
		if (this.#checked !== value) {
			this.#checked = value
			this.#applyDOM(value)
		}
	}
}
