const { readFileSync } = require('fs')
const { readFile } = require('fs/promises')
const path = require('path')

const yaml = require('js-yaml')

/**
 * Load yaml
 * @param   {string} dirname
 * @param   {string} relpath
 * @returns {object}
 */
async function loadYaml(dirname, relpath) {
	const filepath = path.resolve(dirname, relpath + '.yaml')
	const str = await readFile(filepath, 'utf8')
	const obj = yaml.load(str)
	return obj
}

/**
 * Load yaml
 * @param   {string} dirname
 * @param   {string} relpath
 * @returns {object}
 */
function loadYamlSync(dirname, relpath) {
	const filepath = path.resolve(dirname, relpath + '.yaml')
	const str = readFileSync(filepath, 'utf8')
	const obj = yaml.load(str)
	return obj
}

module.exports = {
	loadYaml,
	loadYamlSync,
}
