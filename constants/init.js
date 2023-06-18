const { removeSIPrefix } = require('../utils/DataSizeSupport')
const { mkdirSyncIfNeeded } = require('../utils/FileSupport')

const env = require('./env')

const supplementablePropertyNames = [
	'requestMaxBodySize',
	'uploadChunkSize',
	'uploadMaxFileSize',
	'uploadMaxSize',
]

const placeholderPropertyOperations = {
	postFetchingLimit: env => env.topMaxCount + 1,
	maxChunks: env => Math.ceil(env.uploadMaxSize / env.uploadChunkSize),
}

module.exports = () => {
	// Remove supplementary unit from size constants.
	for (const key in env) {
		if (supplementablePropertyNames.includes(key)) {
			if (typeof env[key] === 'string') {
				env[key] = removeSIPrefix(env[key])
			}
		}
	}

	// Calc placeholders.
	for (const [key, apply] of Object.entries(placeholderPropertyOperations)) {
		if (env[key] === 0) {
			env[key] = apply(env)
		}
	}

	// Init workdir.
	mkdirSyncIfNeeded(env.uploadWorkdir)

	// Immutalize env.
	Object.freeze(env)
}
