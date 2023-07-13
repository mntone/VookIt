import { debounce } from './utils/debounce'
import { ValidationPlugin } from './virtuals/inputs/ValidationPlugin'
import { VirtualInput } from './virtuals/inputs/VirtualInput'
import { VirtualSelect } from './virtuals/inputs/VirtualSelect'
import { VirtualTextBox } from './virtuals/inputs/VirtualTextBox'
import { VirtualButton } from './virtuals/VirtualButton'

/**
 * @typedef ValidationTarget
 * @augments import('./virtuals/inputs/ValidationPlugin').ValidationOptions
 * @property {'textbox' | 'select'} t The element type
 * @property {string}               i The element ID
 */

/**
 * @typedef ValidationConfiguration
 * @property {string}             s The submit button element ID
 * @property {string | undefined} c The cancel button element ID
 * @property {ValidationTarget}   t The input targets
 */

const asCallbackObject = (callback, eventName = 'input') => {
	const callbacks = {}
	callbacks[eventName] = [callback]
	return callbacks
}

class FormValidation {
	/**
	 * @type {VirtualInput[]}
	 */
	#targets

	/**
	 * @type {VirtualButton}
	 */
	#submit

	/**
	 * @type {VirtualButton | undefined}
	 */
	#cancel

	/**
	 * @param {ValidationConfiguration} conf
	 */
	constructor(conf) {
		const callback = debounce(this.#onInput.bind(this), 120)

		this.#targets = conf.t.map(({ i, t, ...options }) => {
			let input
			switch (t) {
			case 'textbox':
				input = new VirtualTextBox(
					document.getElementById(i),
					true,
					asCallbackObject(callback),
				).install(new ValidationPlugin(options))
				break
			case 'select':
				input = new VirtualSelect(
					document.getElementById(i),
					true,
					asCallbackObject(callback),
				)
				break
			default:
				throw Error('Invalid target.')
			}
			return input
		})

		this.#submit = new VirtualButton(document.getElementById(conf.s), true)
		if (conf.c) {
			this.#cancel = new VirtualButton(document.getElementById(conf.c), true)
		}
	}

	#onInput() {
		const isDirty = this.#targets.some(t => t.isDirty)
		this.#submit.disabled = !isDirty || this.#targets.some(t => t.hasError)

		if (this.#cancel) {
			if (isDirty) {
				this.#cancel.elem.classList.add('error')
			} else {
				this.#cancel.elem.classList.remove('error')
			}
		}
	}
}

window.FormValidation = FormValidation
