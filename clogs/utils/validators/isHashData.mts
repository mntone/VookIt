// @ts-expect-error Fix no types
import assertString from 'validator/lib/util/assertString.js'

const sha256base64 = /^[A-Za-z\d+/]{42}(?:[A-Za-z\d+/]{2}|[A-Za-z\d+/]=|==)$/
const sha384base64 = /^[A-Za-z\d+/]{62}(?:[A-Za-z\d+/]{2}|[A-Za-z\d+/]=|==)$/
const sha512base64 = /^[A-Za-z\d+/]{86}(?:[A-Za-z\d+/]{2}|[A-Za-z\d+/]=|==)$/

const shabase64data = /^sha(?:256-[A-Za-z\d+/]{42}(?:[A-Za-z\d+/]{2}|[A-Za-z\d+/]=|==)|384-[A-Za-z\d+/]{62}(?:[A-Za-z\d+/]{2}|[A-Za-z\d+/]=|==)|512-[A-Za-z\d+/]{86}(?:[A-Za-z\d+/]{2}|[A-Za-z\d+/]=|==))$/

export function isSha256Base64(value: string) {
	assertString(value)

	const len = value.length
	if (len !== 44) {
		return false
	}
	return sha256base64.test(value)
}

export function isSha384Base64(value: string) {
	assertString(value)

	const len = value.length
	if (len !== 64) {
		return false
	}
	return sha384base64.test(value)
}

export function isSha512Base64(value: string) {
	assertString(value)

	const len = value.length
	if (len !== 88) {
		return false
	}
	return sha512base64.test(value)
}

export function isHashData(value: string) {
	assertString(value)

	const len = value.length
	if (len !== 51 && len !== 71 && len !== 95) {
		return false
	}
	return shabase64data.test(value)
}
