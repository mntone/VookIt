const { readFileSync } = require('fs')

/**
 * Get software version
 * @returns {string} VookIt! version
 */
function getSoftwareVersion() {
	const ver = process.env.npm_package_version
	if (ver != null) {
		return ver
	} else {
		const json = readFileSync('./package.json')
		const ver2 = JSON.parse(json).version
		return ver2
	}
}

/**
 * Get git hash
 * @returns {string} Git hash
 */
function getGitHashSync() {
	try {
		const rev = readFileSync('./.git/HEAD').toString().trim()
		if (rev.indexOf(':') === -1) {
			return rev
		} else {
			return readFileSync('.git/' + rev.substring(5)).toString().trim()
		}
	} catch {
		return '?'.repeat(40)
	}
}

module.exports = {
	getSoftwareVersion,
	getGitHashSync,
}
