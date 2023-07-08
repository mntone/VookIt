import { PadFilter } from '../../../usecases/filters/pad.mjs'

describe('init', () => {
	test('default', () => {
		const f = new PadFilter()
		expect(f.getWidth()).toBe('iw')
		expect(f.getHeight()).toBe('ih')
		expect(f.getPadX()).toBe(0)
		expect(f.getPadY()).toBe(0)
	})

	test('string with 2 parameters', () => {
		const f = new PadFilter('320:180')
		expect(f.getWidth()).toBe(320)
		expect(f.getHeight()).toBe(180)
		expect(f.getPadX()).toBe(0)
		expect(f.getPadY()).toBe(0)
	})

	test('string with 4 parameters', () => {
		const f = new PadFilter('320:180:(iw-ow)/2:(ih-oh)/2')
		expect(f.getWidth()).toBe(320)
		expect(f.getHeight()).toBe(180)
		expect(f.getPadX()).toBe('(iw-ow)/2')
		expect(f.getPadY()).toBe('(ih-oh)/2')
	})
})

describe('properties', () => {
	test('width', () => {
		const f = new PadFilter().width(320)
		expect(f.getWidth()).toBe(320)
	})

	test('height', () => {
		const f = new PadFilter().height(180)
		expect(f.getHeight()).toBe(180)
	})

	test('padX', () => {
		const f = new PadFilter().padX('(iw-ow)/2')
		expect(f.getPadX()).toBe('(iw-ow)/2')
	})

	test('padY', () => {
		const f = new PadFilter().padY('(ih-oh)/2')
		expect(f.getPadY()).toBe('(ih-oh)/2')
	})
})

describe('build', () => {
	test('build', () => {
		const f = new PadFilter()
		expect(f.build()).toBe('pad')
	})

	test('build with parameters', () => {
		const f = new PadFilter('320:180')
		expect(f.build()).toBe('pad=320:180')
	})

	test('build with exact', () => {
		const f = new PadFilter('320:180:(iw-ow)/2:(ih-oh)/2')
		expect(f.build()).toBe('pad=320:180:(iw-ow)/2:(ih-oh)/2')
	})
})
