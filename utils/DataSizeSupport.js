/**
 * @typedef SupplementaryNumber
 * @property {number}                                  num
 * @property {'k'|'K'|'m'|'M'|'g'|'G'|'t'|'T'|'p'|'P'} unit
 */

const kilo = 1024
const mega = 1024 * kilo
const giga = 1024 * mega
const tera = 1024 * giga
const peta = 1024 * tera
const re = /^(?<num>(?:\d*\.)?\d+)(?<unit>[kmgtp])?$/i

/**
 * @param   {number}  int
 * @param   {number?} fractionDigits
 * @returns {string}
 */
function addSIPrefix(int, fractionDigits = 1) {
	let friendly
	if (int < kilo) {
		friendly = int + ' '
	} else if (int < mega) {
		friendly = (int / kilo).toFixed(fractionDigits) + ' k'
	} else if (int < giga) {
		friendly = (int / mega).toFixed(fractionDigits) + ' M'
	} else if (int < tera) {
		friendly = (int / giga).toFixed(fractionDigits) + ' G'
	} else if (int < peta) {
		friendly = (int / tera).toFixed(fractionDigits) + ' T'
	} else {
		friendly = (int / peta).toFixed(fractionDigits) + ' P'
	}
	return friendly
}

/**
 * @param   {string}              str
 * @returns {SupplementaryNumber}
 */
function meanSIPrefix(str) {
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
function removeSIPrefix(str) {
	const mean = meanSIPrefix(str)
	if (!mean.unit) {
		return mean.num
	}

	let bytes
	switch (mean.unit.toLowerCase()) {
	case 'k':
		bytes = mean.num * kilo
		break
	case 'm':
		bytes = mean.num * mega
		break
	case 'g':
		bytes = mean.num * giga
		break
	case 't':
		bytes = mean.num * tera
		break
	case 'p':
		bytes = mean.num * peta
		break
	default:
		bytes = mean.num
		break
	}
	return bytes
}

/**
 * @param   {string|number} strOrNum
 * @returns {number}
 */
function removeSIPrefixIfNeeded(strOrNum) {
	if (typeof strOrNum === 'string') {
		return removeSIPrefix(strOrNum)
	} else {
		return strOrNum
	}
}

module.exports = {
	addSIPrefix,
	meanSIPrefix,
	removeSIPrefix,
	removeSIPrefixIfNeeded,
}
