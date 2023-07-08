import { HQDeNoise3DFilter } from '../../../usecases/filters/hqdn3d.mjs'

describe('init', () => {
	test('default', () => {
		const f = new HQDeNoise3DFilter()
		expect(f.getLumaSpatial()).toBe(4)
		expect(f.getChromaSpatial()).toBe(3)
		expect(f.getLumaTemporal()).toBe(6)
		expect(f.getChromaTemporal()).toBe(4.5)
	})

	test('string with 1 parameter', () => {
		const v = 5
		const f = new HQDeNoise3DFilter(v.toString())
		expect(f.getLumaSpatial()).toBe(v)
		expect(f.getChromaSpatial()).toBe(3 * v / 4)
		expect(f.getLumaTemporal()).toBe(6 * v / 4)
		expect(f.getChromaTemporal()).toBe(f.getLumaTemporal() * f.getChromaSpatial() / f.getLumaSpatial())
	})

	test('string with 2 parameters', () => {
		const v = 5
		const f = new HQDeNoise3DFilter(`${v}:4`)
		expect(f.getLumaSpatial()).toBe(v)
		expect(f.getChromaSpatial()).toBe(4)
		expect(f.getLumaTemporal()).toBe(6 * v / 4)
		expect(f.getChromaTemporal()).toBe(f.getLumaTemporal() * f.getChromaSpatial() / f.getLumaSpatial())
	})

	test('string with 3 parameters', () => {
		const f = new HQDeNoise3DFilter(`5:4:5`)
		expect(f.getLumaSpatial()).toBe(5)
		expect(f.getChromaSpatial()).toBe(4)
		expect(f.getLumaTemporal()).toBe(5)
		expect(f.getChromaTemporal()).toBe(f.getLumaTemporal() * f.getChromaSpatial() / f.getLumaSpatial())
	})

	test('string with 4 parameters', () => {
		const f = new HQDeNoise3DFilter(`5:4:5:8`)
		expect(f.getLumaSpatial()).toBe(5)
		expect(f.getChromaSpatial()).toBe(4)
		expect(f.getLumaTemporal()).toBe(5)
		expect(f.getChromaTemporal()).toBe(8)
	})
})

describe('properties', () => {
	test('lumaSpatial', () => {
		const f = new HQDeNoise3DFilter().lumaSpatial(5)
		expect(f.getLumaSpatial()).toBe(5)
	})

	test('chromaSpatial', () => {
		const f = new HQDeNoise3DFilter().chromaSpatial(4)
		expect(f.getChromaSpatial()).toBe(4)
	})

	test('lumaTemporal', () => {
		const f = new HQDeNoise3DFilter().lumaTemporal(5)
		expect(f.getLumaTemporal()).toBe(5)
	})

	test('chromaTemporal', () => {
		const f = new HQDeNoise3DFilter().chromaTemporal(8)
		expect(f.getChromaTemporal()).toBe(8)
	})
})

describe('build', () => {
	test('build', () => {
		const f = new HQDeNoise3DFilter()
		expect(f.build()).toBe('hqdn3d')
	})

	test('build with parameters', () => {
		const f = new HQDeNoise3DFilter('5')
		expect(f.build()).toBe('hqdn3d=5:3.75:7.5:5.625')
	})
})
