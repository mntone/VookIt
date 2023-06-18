const DataSizeSupport = require('../utils/DataSizeSupport')

describe('DataSizeSupport', () => {
	describe('addSIPrefix', () => {
		test.each([
			[0, '0 '],
			[1023, '1023 '],
			[1024, '1.0 k'],
			[1024 * 1024 - 1, '1024.0 k'],
			[1024 * 1024, '1.0 M'],
			[1024 * 1024 * 1024 - 1, '1024.0 M'],
			[1024 * 1024 * 1024, '1.0 G'],
			[1024 * 1024 * 1024 * 1024 - 1, '1024.0 G'],
			[1024 * 1024 * 1024 * 1024, '1.0 T'],
			[1024 * 1024 * 1024 * 1024 * 1024 - 1, '1024.0 T'],
			[1024 * 1024 * 1024 * 1024 * 1024, '1.0 P'],
		])('%d with fractionDigits is 1', (a, expected) => {
			const ret = DataSizeSupport.addSIPrefix(a)
			expect(ret).toBe(expected)
		})
	})

	describe('removeSIPrefix', () => {
		test.each([
			['0', 0],
			['1k', 1024],
			['1K', 1024],
			['2K', 2 * 1024],
			['1m', 1024 * 1024],
			['4M', 4 * 1024 * 1024],
			['1g', 1024 * 1024 * 1024],
			['1G', 1024 * 1024 * 1024],
			['1t', 1024 * 1024 * 1024 * 1024],
			['1T', 1024 * 1024 * 1024 * 1024],
			['1p', 1024 * 1024 * 1024 * 1024 * 1024],
			['1P', 1024 * 1024 * 1024 * 1024 * 1024],
		])('%s', (a, expected) => {
			const ret = DataSizeSupport.removeSIPrefix(a)
			expect(ret).toBe(expected)
		})
	})

	describe('removeSIPrefixIfNeeded', () => {
		test.each([
			['0', 0],
			['2K', 2 * 1024],
			['4M', 4 * 1024 * 1024],
			[1024, 1024],
			[45 * 1024, 45 * 1024],
		])('%s', (a, expected) => {
			const ret = DataSizeSupport.removeSIPrefix(a)
			expect(ret).toBe(expected)
		})
	})
})
