const assertString = require('validator/lib/util/assertString')

const cuidRegex = /^c[a-z\d]{24}$/

/**
 * Is CUID.
 * @param   {string}  value
 * @returns {boolean}
 */
function isCUID(value) {
	assertString(value)
	return cuidRegex.test(value)
}

module.exports = isCUID
