import { debounce } from './utils/debounce'
import { ValidationPlugin } from './virtuals/inputs/ValidationPlugin'
import { VirtualTextBox } from './virtuals/inputs/VirtualTextBox'
import { VirtualButton } from './virtuals/VirtualButton'

const asCallbackObject = (callback, eventName = 'input') => {
	const callbacks = {}
	callbacks[eventName] = [callback]
	return callbacks
}

class SignInForm {
	/**
	 * @type {VirtualTextBox}
	 */
	#screenname

	/**
	 * @type {VirtualTextBox}
	 */
	#password

	/**
	 * @type {VirtualButton}
	 */
	#signin

	/**
	 * @param {object}            info
	 * @param {(string|object)[]} info.screenname
	 * @param {(string|object)[]} info.password
	 * @param {string}            info.signin
	 */
	constructor(info) {
		const callback = debounce(this.#onInput.bind(this), 120)
		this.#screenname = new VirtualTextBox(
			document.getElementById(info.screenname[0]),
			true,
			asCallbackObject(callback),
		).install(new ValidationPlugin(info.screenname[1]))
		this.#password = new VirtualTextBox(
			document.getElementById(info.password[0]),
			true,
			asCallbackObject(callback),
		).install(new ValidationPlugin(info.password[1]))
		this.#signin = new VirtualButton(document.getElementById(info.signin), true)
	}

	#onInput() {
		const isDirty = this.#screenname.isDirty && this.#password.isDirty
		this.#signin.disabled = this.#screenname.hasError
			|| this.#password.hasError
			|| !isDirty
	}
}

window.SignInForm = SignInForm
