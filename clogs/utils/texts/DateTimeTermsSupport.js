const secToMs = 1000
const minToMs = 60 * secToMs
const hrToMs = 60 * minToMs
const dToMs = 24 * hrToMs

const minToSec = 60
const hrToSec = 60 * minToSec
const dToSec = 24 * hrToSec

const re = /^(?<num>(?:\d*\.)?\d+) ?(?<unit>(?:ms|millisecond|milliseconds|s|sec|second|seconds|min|minute|minutes|h|hr|hrs|hour|hours|d|day|days))?$/i

/**
 * @typedef DateTimeTerms
 * @property {number} num
 * @property {string} unit
 */

/**
 * @param   {string}        str
 * @returns {DateTimeTerms}
 */
function meanTerms(str) {
	const result = re.exec(str)
	return {
		num: Number(result.groups.num),
		unit: result.groups.unit,
	}
}

/**
 * @param   {string} str
 * @returns {number}
 */
function termsToMilliseconds(str) {
	const mean = meanTerms(str)

	let milliseconds
	switch (mean.unit.toLocaleLowerCase()) {
	case 's':
	case 'sec':
	case 'second':
	case 'seconds':
		milliseconds = mean.num * secToMs
		break
	case 'min':
	case 'minute':
	case 'minutes':
		milliseconds = mean.num * minToMs
		break
	case 'h':
	case 'hr':
	case 'hrs':
	case 'hour':
	case 'hours':
		milliseconds = mean.num * hrToMs
		break
	case 'd':
	case 'day':
	case 'days':
		milliseconds = mean.num * dToMs
		break
	default:
		milliseconds = mean.num
		break
	}
	return milliseconds
}

/**
 * @param   {string} str
 * @returns {number}
 */
function termsToSeconds(str) {
	const mean = meanTerms(str)

	let seconds
	switch (mean.unit.toLocaleLowerCase()) {
	case 'min':
	case 'minute':
	case 'minutes':
		seconds = mean.num * minToSec
		break
	case 'h':
	case 'hr':
	case 'hrs':
	case 'hour':
	case 'hours':
		seconds = mean.num * hrToSec
		break
	case 'd':
	case 'day':
	case 'days':
		seconds = mean.num * dToSec
		break
	default:
		seconds = mean.num
		break
	}
	return seconds
}

/**
 * @param   {string|number|boolean|bigint} strOrNum
 * @param                                  defaultValue
 * @returns {number}
 */
function ambiguousTermsToSeconds(strOrNum, defaultValue) {
	let seconds
	switch (typeof strOrNum) {
	case 'string':
		seconds = termsToSeconds(strOrNum)
		break
	case 'number':
		seconds = strOrNum
		break
	case 'boolean':
		seconds = strOrNum ? defaultValue + 1 : defaultValue
		break
	case 'bigint':
		seconds = Number(strOrNum)
		break
	default:
		seconds = defaultValue
		break
	}
	return seconds
}

module.exports = {
	meanTerms,
	termsToMilliseconds,
	termsToSeconds,
	ambiguousTermsToSeconds,
}
