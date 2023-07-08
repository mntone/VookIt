import { UnsharpFilter } from '../../../usecases/filters/unsharp.mjs'

describe('init', () => {
	test('default', () => {
		const f = new UnsharpFilter()
		expect(f.getLumaX()).toBe(5)
		expect(f.getLumaY()).toBe(5)
		expect(f.getLumaAmount()).toBe(1)
		expect(f.getChromaX()).toBe(5)
		expect(f.getChromaY()).toBe(5)
		expect(f.getChromaAmount()).toBe(0)
		expect(f.getAlphaX()).toBe(5)
		expect(f.getAlphaY()).toBe(5)
		expect(f.getAlphaAmount()).toBe(0)
	})

	test('string with 3 parameters', () => {
		const f = new UnsharpFilter('3:3:0.5')
		expect(f.getLumaX()).toBe(3)
		expect(f.getLumaY()).toBe(3)
		expect(f.getLumaAmount()).toBe(0.5)
		expect(f.getChromaX()).toBe(5)
		expect(f.getChromaY()).toBe(5)
		expect(f.getChromaAmount()).toBe(0)
		expect(f.getAlphaX()).toBe(5)
		expect(f.getAlphaY()).toBe(5)
		expect(f.getAlphaAmount()).toBe(0)
	})

	test('string with 6 parameters', () => {
		const f = new UnsharpFilter('2:24:0.5:3.5:3.5:0.25')
		expect(f.getLumaX()).toBe(3)
		expect(f.getLumaY()).toBe(23)
		expect(f.getLumaAmount()).toBe(0.5)
		expect(f.getChromaX()).toBe(3.5)
		expect(f.getChromaY()).toBe(3.5)
		expect(f.getChromaAmount()).toBe(0.25)
		expect(f.getAlphaX()).toBe(5)
		expect(f.getAlphaY()).toBe(5)
		expect(f.getAlphaAmount()).toBe(0)
	})

	test('string with 9 parameters', () => {
		const f = new UnsharpFilter('2:24:0.5:-4:145:0.05:6:6:1')
		expect(f.getLumaX()).toBe(3)
		expect(f.getLumaY()).toBe(23)
		expect(f.getLumaAmount()).toBe(0.5)
		expect(f.getChromaX()).toBe(3)
		expect(f.getChromaY()).toBe(23)
		expect(f.getChromaAmount()).toBe(0.05)
		expect(f.getAlphaX()).toBe(6)
		expect(f.getAlphaY()).toBe(6)
		expect(f.getAlphaAmount()).toBe(1)
	})
})

const getterPropertyName = (name: string) => {
	return 'get' + name.charAt(0).toUpperCase() + name.slice(1)
}

describe('propertiesXY', () => {
	const propertiesXY = ['lumaX', 'lumaY', 'chromaX', 'chromaY', 'alphaX', 'alphaY']

	test.each(propertiesXY)('%s', name => {
		const f = new UnsharpFilter()
		eval('f.' + name + '(3)')
		expect(eval('f.' + getterPropertyName(name) + '()')).toBe(3)
	})

	test.each(propertiesXY)('%s (throw when even)', name => {
		const f = new UnsharpFilter()
		expect(() => eval('f.' + name + '(4)')).toThrow('The value is odd number.')
	})

	test.each(propertiesXY)('%s (throw when < 3)', name => {
		const f = new UnsharpFilter()
		expect(() => eval('f.' + name + '(-3)')).toThrow('The value is greater than 3.')
	})

	test.each(propertiesXY)('%s (throw when > 23)', name => {
		const f = new UnsharpFilter()
		expect(() => eval('f.' + name + '(25)')).toThrow('The value is less than 23.')
	})
})

describe('propertiesAmount', () => {
	const propertiesAmount = ['lumaAmount', 'chromaAmount', 'alphaAmount']

	test.each(propertiesAmount)('%s', name => {
		const f = new UnsharpFilter()
		eval('f.' + name + '(0.5)')
		expect(eval('f.' + getterPropertyName(name) + '()')).toBe(0.5)
	})

	test.each(propertiesAmount)('%s (throw when < -2)', name => {
		const f = new UnsharpFilter()
		expect(() => eval('f.' + name + '(-4)')).toThrow('The value is greater than -2.')
	})

	test.each(propertiesAmount)('%s (throw when > 5)', name => {
		const f = new UnsharpFilter()
		expect(() => eval('f.' + name + '(6)')).toThrow('The value is less than 5.')
	})
})

describe('build', () => {
	test('build', () => {
		const f = new UnsharpFilter()
		expect(f.build()).toBe('unsharp')
	})

	test('build with 3 parameters', () => {
		const f = new UnsharpFilter('3:3:0.5')
		expect(f.build()).toBe('unsharp=3:3:0.5')
	})

	test('build with 6 parameters', () => {
		const f = new UnsharpFilter('3:3:0.5:3:3:0.5')
		expect(f.build()).toBe('unsharp=3:3:0.5:3:3:0.5')
	})

	test('build with 9 parameters', () => {
		const f = new UnsharpFilter('3:3:0.5:3:3:0.5:3:3:0.5')
		expect(f.build()).toBe('unsharp=3:3:0.5:3:3:0.5:3:3:0.5')
	})
})
