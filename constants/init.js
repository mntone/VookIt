const deepFreeze = require('deep-freeze')

const { termsToMilliseconds } = require('../clogs/utils/texts/DateTimeTermsSupport')
const { removeSIPrefix } = require('../utils/DataSizeSupport')
const { mkdirSyncIfNeeded } = require('../utils/FileSupport')

const env = require('./env')

const supplementablePropertyNames = [
	'requestMaxBodySize',
	'uploadMaxChunkSize',
	'uploadMaxTotalSize',
	'uploadMaxFileSize',
]

const durationAsMillisecondsPropertyNames = [
	'hawksDefaultStalledDuration',
	'hawksEncodeDelayToSaveIntermediateStream',
]

const placeholderPropertyOperations = {
	postFetchingLimit: env => env.topMaxCount + 1,
	maxChunks: env => Math.ceil(env.uploadMaxSize / env.uploadChunkSize),
}

module.exports = () => {
	// Remove SI prefix unit from size constants.
	for (const key in env) {
		if (supplementablePropertyNames.includes(key)) {
			if (typeof env[key] === 'string') {
				env[key] = removeSIPrefix(env[key])
			}
		}
	}

	// Remove time unit.
	for (const key in env) {
		if (durationAsMillisecondsPropertyNames.includes(key)) {
			if (typeof env[key] === 'string') {
				env[key] = termsToMilliseconds(env[key])
			}
		}
	}
	for (const [key, hawksQueue] of Object.entries(env.hawksQueues)) {
		if (Object.prototype.hasOwnProperty.call(hawksQueue, 'stalledDuration')) {
			env.hawksQueues[key].stalledDuration = termsToMilliseconds(hawksQueue.stalledDuration)
		}
	}

	// Calc placeholders.
	for (const [key, apply] of Object.entries(placeholderPropertyOperations)) {
		if (env[key] === 0) {
			env[key] = apply(env)
		}
	}

	// Update parameters in dev mode
	if (process.env.NODE_ENV === 'development') {
		env.uploadMaxFileSize *= env.uploadMaxFileSizeMultiplierInDev
	}
	delete env.uploadMaxFileSizeMultiplierInDev

	// Init workdir.
	mkdirSyncIfNeeded(env.uploadWorkdir)

	// Immutalize env.
	deepFreeze(env)
}
