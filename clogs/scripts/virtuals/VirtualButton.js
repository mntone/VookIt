import { VirtualElement } from './VirtualElement'

export class VirtualButton extends VirtualElement {
	/**
	 * @type {boolean}
	 */
	#disabled

	/**
	 * @param {HTMLButtonElement} elem
	 * @param {boolean}           disabled
	 */
	constructor(elem, disabled) {
		super(elem)
		this.#disabled = disabled

		if (disabled != null && elem.disabled !== disabled) {
			this.#applyDisabled(disabled)
		}
	}

	/**
	 * @type {boolean}
	 */
	get disabled() {
		return this.#disabled
	}
	/**
	 * @type {boolean}
	 */
	set disabled(value) {
		if (this.#disabled !== value) {
			this.#disabled = value
			this.#applyDisabled(value)
		}
	}

	#applyDisabled(disabled) {
		this.elem.disabled = disabled
	}
}
