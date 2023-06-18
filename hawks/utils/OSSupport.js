const os = require('os')

/**
 * @returns {boolean}
 */
function isMac() {
	return os.platform() === 'darwin'
}

module.exports = {
	isMac,
}
