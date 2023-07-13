import { VirtualElement } from '../VirtualElement'

export class VirtualCallbackElement extends VirtualElement {
	/**
	 * @type {{ [key: string]: ((e: InputEvent) => void)[] }}
	 */
	#callbacks

	/**
	 * @param {HTMLInputElement}                               elem
	 * @param {{ [key: string]: ((e: InputEvent) => void)[] }} callbacks
	 */
	constructor(elem, callbacks) {
		super(elem)
		this.#callbacks = callbacks
	}

	install(plugin) {
		plugin.connect(this)
		return this
	}

	/**
	 * Register callback for event name.
	 * @param {string}                  eventName Event name
	 * @param {(e: InputEvent) => void} callback  Callback
	 */
	on(eventName, callback) {
		if (!this.#callbacks[eventName]) {
			this.#callbacks[eventName] = {}
		}
		this.#callbacks[eventName].push(callback)
	}

	/**
	 * Get callbacks for event name.
	 * @param   {string}                      eventName Event name
	 * @returns {((e: InputEvent) => void)[]}           Callbacks
	 */
	_callbacksFor(eventName) {
		return this.#callbacks[eventName]
	}

	/**
	 * Raise event to callback
	 * @param {string} eventName Event name
	 * @param {Event}  e         Event
	 */
	_raise(eventName, e) {
		this.#callbacks[eventName].forEach(c => c(e))
	}
}
