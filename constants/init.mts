import deepFreeze from 'deep-freeze'
import { PickByValueExact } from 'utility-types'

import { DateTimeString, termsToMilliseconds } from '../shared/utils/datetimeTerms.mjs'
import { removeSIPrefix } from '../utils/DataSizeSupport.js'
import { mkdirSyncIfNeeded } from '../utils/FileSupport.js'

import env from './env.js'

type EnvType = typeof env

const supplementablePropertyNames: (keyof PickByValueExact<EnvType, string | number>)[] = [
	'uploadMaxChunkSize',
	'uploadMaxTotalSize',
	'uploadMaxFileSize',
]

const durationAsMillisecondsPropertyNames: (keyof PickByValueExact<EnvType, DateTimeString | number>)[] = [
	'hawksDefaultStalledDuration',
	'hawksEncodeDelayToSaveIntermediateStream',
]

type PlaceholderKeyType = 'postFetchingLimit' | 'uploadMaxChunks'

const placeholderPropertyOperations: Partial<Record<PlaceholderKeyType, (env: EnvType) => number>> = {
	postFetchingLimit: (env: EnvType) => env.topMaxCount + 1,
	uploadMaxChunks: (env: EnvType) => Math.ceil((env.uploadMaxTotalSize as unknown as number) / (env.uploadMaxChunkSize as unknown as number)),
}

export default () => {
	// Remove SI prefix unit from size constants.
	for (const key of supplementablePropertyNames) {
		if (typeof env[key] === 'string') {
			env[key] = removeSIPrefix(env[key] as string)
		}
	}

	// Remove time unit.
	for (const key of durationAsMillisecondsPropertyNames) {
		if (typeof env[key] === 'string') {
			env[key] = termsToMilliseconds(env[key] as DateTimeString)
		}
	}
	for (const [key, hawksQueue] of Object.entries(env.hawksQueues)) {
		if (Object.prototype.hasOwnProperty.call(hawksQueue, 'stalledDuration')) {
			// @ts-expect-error Force casting.
			env.hawksQueues[key].stalledDuration = termsToMilliseconds(hawksQueue.stalledDuration as DateTimeString)
		}
	}

	// Calc placeholders.
	for (const [key, apply] of Object.entries(placeholderPropertyOperations)) {
		if (env[key as PlaceholderKeyType] === 0) {
			env[key as PlaceholderKeyType] = apply(env)
		}
	}

	// Init workdir.
	mkdirSyncIfNeeded(env.uploadWorkdir)

	// Immutalize env.
	deepFreeze(env)
}
