const secToMs = 1000
const minToMs = 60 * secToMs
const hrToMs = 60 * minToMs
const dToMs = 24 * hrToMs
const wToMs = 7 * dToMs

const minToSec = 60
const hrToSec = 60 * minToSec
const dToSec = 24 * hrToSec
const wToSec = 7 * dToSec

const re = /^(?<num>(?:\d*\.)?\d+) *(?<unit>(?:ms|msecs?|milliseconds?|s|secs?|seconds?|mins?|minutes?|h|hrs?|hours?|d|dys?|days?|w|kws?|weeks?))?$/i

export type DateTimeSecUnit
	= 's'
	| 'sec'
	| 'secs'
	| 'second'
	| 'seconds'
	| 'min'
	| 'mins'
	| 'minute'
	| 'minutes'
	| 'h'
	| 'hr'
	| 'hrs'
	| 'hours'
	| 'd'
	| 'dy'
	| 'dys'
	| 'day'
	| 'days'
	| 'w'
	| 'wk'
	| 'wks'
	| 'week'
	| 'weeks'

export type DateTimeUnit
	= 'ms'
	| 'msec'
	| 'msecs'
	| DateTimeSecUnit

export type DateTimeSecString
	= `${number}`
	| `${number}${DateTimeSecUnit}`
	| `${number} ${DateTimeSecUnit}`

export type DateTimeString
	= `${number}`
	| `${number}${DateTimeUnit}`
	| `${number} ${DateTimeUnit}`

export type DateTimeTerms = {
	num: number
	unit: string
}

export function meanTerms(str: DateTimeString): DateTimeTerms {
	const result = re.exec(str)
	if (!result) {
		throw new Error('Invalid terms.')
	}

	return {
		num: Number(result.groups!.num),
		unit: result.groups!.unit,
	}
}

export function termsToMilliseconds(str: DateTimeString): number {
	const mean = meanTerms(str)

	let milliseconds
	switch (mean.unit.toLowerCase()) {
	case 's':
	case 'sec':
	case 'secs':
	case 'second':
	case 'seconds':
		milliseconds = mean.num * secToMs
		break
	case 'min':
	case 'mins':
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
	case 'dy':
	case 'dys':
	case 'day':
	case 'days':
		milliseconds = mean.num * dToMs
		break
	case 'w':
	case 'wk':
	case 'wks':
	case 'week':
	case 'weeks':
		milliseconds = mean.num * wToMs
		break
	default:
		milliseconds = mean.num
		break
	}
	return milliseconds
}

export function termsToSeconds(str: DateTimeSecString): number {
	const mean = meanTerms(str)

	let seconds
	switch (mean.unit.toLowerCase()) {
	case 'min':
	case 'mins':
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
	case 'dy':
	case 'dys':
	case 'day':
	case 'days':
		seconds = mean.num * dToSec
		break
	case 'w':
	case 'wk':
	case 'wks':
	case 'week':
	case 'weeks':
		seconds = mean.num * wToSec
		break
	default:
		seconds = mean.num
		break
	}
	return seconds
}

export function ambiguousTermsToSeconds(
	strOrNum: DateTimeSecString | number,
	defaultValue?: number,
): number {
	let seconds
	switch (typeof strOrNum) {
	case 'string':
		seconds = termsToSeconds(strOrNum)
		break
	case 'number':
		seconds = strOrNum
		break
	default:
		if (!defaultValue) {
			throw new Error('Invalid terms.')
		}
		seconds = defaultValue
		break
	}
	return seconds
}
