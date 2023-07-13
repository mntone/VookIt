import { ModalSupport } from '../utils/ModalSupport'
import { preferredReducedMotion } from '../utils/StyleStateHelpers'
import { VirtualCheckBox } from '../virtuals/inputs/VirtualCheckBox'

const FALSE_VALUE = ''
const TRUE_VALUE = 'T'
const ANIMATION_KEY = 'AppearanceState.animation'
const NOSCALE_KEY = 'AppearanceState.noscale'

class AppearanceState {
	/**
	 * Storage
	 * @type {Storage}
	 */
	#storage

	/**
	 * Enable animations
	 * @type {boolean}
	 */
	#animation

	/**
	 * Disable video scale
	 * @type {boolean}
	 */
	#noscale

	constructor(storage = window.localStorage) {
		this.#storage = storage
		this.#animation = !preferredReducedMotion()
		this.#noscale = false
		this.load()
	}

	reset() {
		this.#storage.removeItem(ANIMATION_KEY)
		this.#storage.removeItem(NOSCALE_KEY)
	}

	load() {
		const animation = this.#storage.getItem(ANIMATION_KEY)
		if (animation != null) {
			this.#animation = animation === TRUE_VALUE
			AppearanceState.#updateAnimation(this.#animation)
		}

		const noscale = this.#storage.getItem(NOSCALE_KEY)
		if (noscale != null) {
			this.#noscale = noscale === TRUE_VALUE
			AppearanceState.#updateNoscale(this.#noscale)
		}
	}

	#setValue(key, value) {
		this.#storage.setItem(key, value ? TRUE_VALUE : FALSE_VALUE)
	}

	/**
	 * Get animation state.
	 * @type {boolean}
	 */
	get animation() {
		return this.#animation
	}
	/**
	 * Set animation state.
	 * @type {boolean}
	 */
	set animation(value) {
		if (this.#animation !== value) {
			this.#animation = value
			this.#setValue(ANIMATION_KEY, value)
			AppearanceState.#updateAnimation(value)
		}
	}
	static #updateAnimation(value) {
		if (preferredReducedMotion()) {
			if (value) {
				document.body.classList.add('no-reduced-motion')
			} else {
				document.body.classList.remove('no-reduced-motion')
			}
		} else {
			if (value) {
				document.body.classList.remove('use-reduced-motion')
			} else {
				document.body.classList.add('use-reduced-motion')
			}
		}
	}

	/**
	 * Get noscale state.
	 * @type {boolean}
	 */
	get noscale() {
		return this.#noscale
	}
	/**
	 * Set noscale state.
	 * @type {boolean}
	 */
	set noscale(value) {
		if (this.#noscale !== value) {
			this.#noscale = value
			this.#setValue(NOSCALE_KEY, value)
			AppearanceState.#updateNoscale(value)
		}
	}
	static #updateNoscale(value) {
		if (value) {
			document.body.classList.add('no-scale')
		} else {
			document.body.classList.remove('no-scale')
		}
	}
}

export class AppearanceModal extends ModalSupport {
	/**
	 * @type {AppearanceState}
	 */
	#state

	/**
	 * @type {VirtualCheckBox}
	 */
	#animation

	/**
	 * @type {VirtualCheckBox}
	 */
	#noscale

	constructor(modalId = 'AppearanceModal') {
		super(modalId)

		this._hookDefaultClose()
		document.getElementById(modalId + '-save').addEventListener('click', this.#onSaveClick.bind(this))

		const state = new AppearanceState()
		this.#animation = new VirtualCheckBox(document.getElementById(modalId + '-animation'), state.animation, true)
		this.#noscale = new VirtualCheckBox(document.getElementById(modalId + '-noscale'), state.noscale, true)
		this.#state = state
	}

	_onClose() {
		this._closeModal()

		// Restore values
		this.#animation.checked = this.#state.animation
		this.#noscale.checked = this.#state.noscale
	}

	#onSaveClick() {
		this._closeModal()

		// Save values
		this.#state.animation = this.#animation.checked
		this.#state.noscale = this.#noscale.checked
	}
}
