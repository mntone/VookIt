const { readFileSync } = require('fs')
const { readFile } = require('fs/promises')
const path = require('path')

const yaml = require('js-yaml')

class ConfigLoader {
	/**
	 * @type {string}
	 */
	#filepath

	/**
	 * @type {string}
	 */
	#fileext

	/**
	 * @type {function(string): object}
	 */
	#parse

	/**
	 * @param {string}        filepath
	 * @param {'yaml'|'json'} format
	 */
	constructor(filepath, format) {
		this.#filepath = filepath

		switch (format) {
		case 'json':
			this.#fileext = '.json'
			this.#parse = JSON.parse
			break
		case 'yaml':
			this.#fileext = '.yaml'
			this.#parse = yaml.load
			break
		default:
			throw Error(`This value (${format.toString()}) is invalid format.`)
		}
	}

	/**
	 * Load target config file.
	 * @param   {string}          name Config filename
	 * @returns {Promise<object>}
	 */
	async load(name) {
		const filepath = path.join(this.#filepath, name + this.#fileext)
		const str = await readFile(filepath, 'utf8')
		const obj = this.#parse(str)
		return obj
	}

	/**
	 * Load target config file.
	 * @param   {string} name Config filename
	 * @returns {object}
	 */
	loadSync(name) {
		const filepath = path.join(this.#filepath, name + this.#fileext)
		const str = readFileSync(filepath, 'utf8')
		const obj = this.#parse(str)
		return obj
	}
}

module.exports = ConfigLoader
