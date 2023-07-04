import { isHashData, isSha256Base64, isSha384Base64, isSha512Base64 } from '../../../utils/validators/isHashData.mjs'

// Memo: All valid seed is "seed".

describe('sha256', () => {
	test('is valid', () => {
		expect(isSha256Base64('GbJYVuHBUMqDTP/ItZsjrb0OwDieWOsis7ZHaAmNACs=')).toBe(true)
	})

	test('is invalid (first =)', () => {
		expect(isSha256Base64('=bJYVuHBUMqDTP/ItZsjrb0OwDieWOsis7ZHaAmNACs=')).toBe(false)
	})
})

describe('sha384', () => {
	test('is valid', () => {
		expect(isSha384Base64('6qXjuZeQEoMpB7ABcMvO+mdTddAH0fnMxcHJozCIcfLJCaN1alYbKaSVrtrkjNO1')).toBe(true)
	})

	test('is invalid (triple ===)', () => {
		expect(isSha384Base64('6qXjuZeQEoMpB7ABcMvO+mdTddAH0fnMxcHJozCIcfLJCaN1alYbKaSVrtrkj===')).toBe(false)
	})
})

describe('sha512', () => {
	test('is valid', () => {
		expect(isSha512Base64('fPLlcwzeoi98L26PuSb/c4Rksg7GGluKHIP0+s7NrjBvKaK3aFItXPDzZ3R/MM45x0hjJ4+ubCfhfOnjC2zL2Q==')).toBe(true)
	})

	test('is invalid (mid =)', () => {
		expect(isSha512Base64('fPLlcwzeoi98L26PuSb/c4Rksg7GGluKHIP0+=7NrjBvKaK3aFItXPDzZ3R/MM45x0hjJ4+ubCfhfOnjC2zL2Q==')).toBe(false)
	})
})

describe('shadata', () => {
	test('of sha256 is valid', () => {
		expect(isHashData('sha256-GbJYVuHBUMqDTP/ItZsjrb0OwDieWOsis7ZHaAmNACs=')).toBe(true)
	})

	test('of sha384 is valid', () => {
		expect(isHashData('sha384-6qXjuZeQEoMpB7ABcMvO+mdTddAH0fnMxcHJozCIcfLJCaN1alYbKaSVrtrkjNO1')).toBe(true)
	})

	test('of sha512 is valid', () => {
		expect(isHashData('sha512-fPLlcwzeoi98L26PuSb/c4Rksg7GGluKHIP0+s7NrjBvKaK3aFItXPDzZ3R/MM45x0hjJ4+ubCfhfOnjC2zL2Q==')).toBe(true)
	})
})

