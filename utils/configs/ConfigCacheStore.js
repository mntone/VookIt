const deepFreeze = require('deep-freeze')

const ConfigLoader = require('./ConfigLoader')

class ConfigCacheStore extends ConfigLoader {
	#cache = {}

	/**
	 * @param   {string}          name
	 * @returns {Promise<object>}
	 */
	async load(name) {
		const key = name.split('.', 2)[0]
		if (!Object.prototype.hasOwnProperty.call(this.#cache, key)) {
			const config = await super.load(name)
			this._process(name, config)
			this.#cache[key] = deepFreeze(config)
			return config
		}
		return this.#cache[key]
	}

	/**
	 * @param   {string} name
	 * @returns {object}
	 */
	loadSync(name) {
		const key = name.split('.', 2)
		if (!Object.prototype.hasOwnProperty.call(this.#cache, key)) {
			const config = super.loadSync(name)
			this._process(name, config)
			this.#cache[key] = deepFreeze(config)
			return config
		}
		return this.#cache[key]
	}

	/**
	 * @param {string} name   Config filename.
	 * @param {object} config Config object.
	 */
	// eslint-disable-next-line no-unused-vars
	_process(name, config) {
		// Nothing.
	}
}

module.exports = ConfigCacheStore
