const { getSoftwareVersion, getGitHashSync } = require('../utils/VersionSupport')

const version = Object.freeze({
	name: 'VookIt!',
	version: getSoftwareVersion(),
	hash: getGitHashSync().slice(0, 7),
})

module.exports = () => version
