import { debounce } from './utils/debounce'
import { ValidationPlugin } from './virtuals/inputs/ValidationPlugin'
import { VirtualSelect } from './virtuals/inputs/VirtualSelect'
import { VirtualTextBox } from './virtuals/inputs/VirtualTextBox'
import { VirtualButton } from './virtuals/VirtualButton'

const asCallbackObject = (callback, eventName = 'input') => {
	const callbacks = {}
	callbacks[eventName] = [callback]
	return callbacks
}

class EditForm {
	/**
	 * @type {VirtualTextBox}
	 */
	#title

	/**
	 * @type {VirtualTextBox}
	 */
	#description

	/**
	 * @type {VirtualSelect}
	 */
	#visibility

	/**
	 * @type {VirtualButton}
	 */
	#update

	/**
	 * @type {VirtualButton}
	 */
	#cancel

	/**
	 * @param {object}            info
	 * @param {(string|object)[]} info.title
	 * @param {(string|object)[]} info.description
	 * @param {string}            info.update
	 * @param {string}            info.cancel
	 */
	constructor(info) {
		const callback = debounce(this.#onInput.bind(this), 120)
		this.#title = new VirtualTextBox(
			document.getElementById(info.title[0]),
			true,
			asCallbackObject(callback),
		).install(new ValidationPlugin(info.title[1]))
		this.#description = new VirtualTextBox(
			document.getElementById(info.description[0]),
			true,
			asCallbackObject(callback),
		).install(new ValidationPlugin(info.description[1]))
		this.#visibility = new VirtualSelect(
			document.getElementById(info.visibility),
			true,
			asCallbackObject(callback),
		)
		this.#update = new VirtualButton(document.getElementById(info.update), true)
		this.#cancel = new VirtualButton(document.getElementById(info.cancel), true)
	}

	#onInput() {
		const isDirty = this.#visibility.isDirty || this.#title.isDirty || this.#description.isDirty
		this.#update.disabled = this.#title.hasError
			|| this.#description.hasError
			|| !isDirty

		if (isDirty) {
			this.#cancel.elem.classList.add('error')
		} else {
			this.#cancel.elem.classList.remove('error')
		}
	}
}

window.EditForm = EditForm
