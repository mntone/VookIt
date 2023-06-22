const { ambiguousTermsToSeconds } = require('../texts/DateTimeTermsSupport')

/**
 * @typedef CacheControlOptions
 * @property {boolean?}      mustRevalidate
 * @property {boolean?}      private
 * @property {string|number} maxAge
 * @property {string|number} sharedMaxAge
 * @property {boolean?}      noCache
 * @property {boolean?}      noStore
 * @property {boolean?}      immutable
 */

/**
 * @param   {CacheControlOptions}              options
 * @returns {import('express').RequestHandler}
 */
function defineCacheControl(options) {
	if (process.env.NODE_ENV === 'development') {
		return (_, res, next) => {
			if (!res.get('Cache-Control')) {
				res.set('Cache-Control', 'no-store')
			}
			next()
		}
	}

	const cacheControlArgs = []

	// Cache-Control: no-store
	if (options.noStore) {
		if (options.private) {
			cacheControlArgs.push('private')
		}

		cacheControlArgs.push('no-store')

	// Cache-Control: no-cache
	} else if (options.noCache) {
		if (options.private) {
			cacheControlArgs.push('private')
		}

		cacheControlArgs.push('no-cache')

	// Others
	} else {
		if (options.private) {
			cacheControlArgs.push('private')
		}

		if (options.maxAge) {
			const seconds = ambiguousTermsToSeconds(options.maxAge, -1)
			if (seconds >= 0) {
				cacheControlArgs.push('max-age=' + seconds)

				if (options.mustRevalidate) {
					cacheControlArgs.push('must-revalidate')
				}
			}
		}

		if (!options.private && options.sharedMaxAge) {
			const seconds = ambiguousTermsToSeconds(options.sharedMaxAge, -1)
			if (seconds >= 0) {
				cacheControlArgs.push('s-maxage=' + seconds)
			}
		}

		if (options.immutable) {
			cacheControlArgs.push('immutable')
		}
	}

	const cacheControl = cacheControlArgs.join(', ')
	return (_, res, next) => {
		if (!res.get('Cache-Control')) {
			res.set('Cache-Control', cacheControl)
		}
		next()
	}
}

module.exports = {
	cachecontrol: defineCacheControl,

	nocache: defineCacheControl({
		noCache: true,
	}),

	nostore: defineCacheControl({
		noStore: true,
	}),
}
