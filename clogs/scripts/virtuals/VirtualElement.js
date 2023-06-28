
export class VirtualElement {
	/**
	 * @type {HTMLElement}
	 */
	#elem

	/**
	 * @param {HTMLElement} elem
	 */
	constructor(elem) {
		this.#elem = elem
	}

	/**
	 * @type {HTMLElement}
	 */
	get element() {
		return this.#elem
	}
}
