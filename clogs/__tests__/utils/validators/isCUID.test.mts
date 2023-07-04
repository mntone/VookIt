import isCUID from '../../../utils/validators/isCUID.js'

describe('CUID', () => {
	test('is valid', () => {
		expect(isCUID('ch72gsb320000udocl363eofy')).toBe(true)
	})

	test('is invalid', () => {
		expect(isCUID('hh72gsb320000udocl363eofy')).toBe(false)
	})
})
