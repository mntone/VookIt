const IS_ACTIVE_STATE_CLASS = 'is-active'
const IS_POPOVER_ACTIVE_STATE_CLASS = 'is-popover-active'
const MODAL_TRIGGER_QUERY = '.hint-popoverable'

export default class ModalSupport {
	static #keyboardHooked = false
	static #controlHooked = false

	/**
	 * @type {ModalSupport[]}
	 */
	static #modals = {}

	/**
	 * Modal element
	 * @type {HTMLElement}
	 */
	#modal

	constructor(modalId) {
		const modal = document.getElementById(modalId)
		this.#modal = modal

		if (!ModalSupport.#keyboardHooked) {
			ModalSupport.#keyboardHooked = true
			document.addEventListener('keydown', ModalSupport.#onClose)
		}
		ModalSupport.#modals[modalId] = this
	}

	_hookDefaultClose() {
		const targets = this.#modal.querySelectorAll('.modal-background,.delete')
		const onClose = this._onClose.bind(this)
		targets.forEach(target => target.addEventListener('click', onClose))
	}

	_onControlClick() {
		document.body.classList.add(IS_POPOVER_ACTIVE_STATE_CLASS)
		this.#modal.classList.add(IS_ACTIVE_STATE_CLASS)
	}

	_closeModal() {
		document.body.classList.remove(IS_POPOVER_ACTIVE_STATE_CLASS)
		this.#modal.classList.remove(IS_ACTIVE_STATE_CLASS)
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	// eslint-disable-next-line no-unused-vars
	_onClose(e) {
		// Nothing.
	}

	/**
	 * @type {HTMLElement}
	 */
	get _modal() {
		return this.#modal
	}

	/**
	 * Hook modal button
	 */
	static hook() {
		if (!ModalSupport.#keyboardHooked || ModalSupport.#controlHooked) {
			return
		}
		ModalSupport.#controlHooked = true

		document.querySelectorAll(MODAL_TRIGGER_QUERY).forEach(elem => {
			const modalId = elem.dataset.target
			const modalSupport = ModalSupport.#modals[modalId]
			if (!modalSupport) {
				return
			}

			elem.addEventListener('click', modalSupport._onControlClick.bind(modalSupport))
			elem.disabled = false
		})
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	static #onClose(e) {
		const key = e.key
		if (key === 'Escape' || key === 'Esc') {
			for (const modal of Object.values(ModalSupport.#modals)) {
				modal._onClose(e)
				if (e.defaultPrevented) {
					break
				}
			}
		}
	}
}
