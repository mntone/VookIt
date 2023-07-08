import { CropFilter } from '../../../usecases/filters/crop.mjs'

describe('init', () => {
	test('default', () => {
		const f = new CropFilter()
		expect(f.getWidth()).toBe('iw')
		expect(f.getHeight()).toBe('ih')
		expect(f.getCropX()).toBe('(iw-ow)/2')
		expect(f.getCropY()).toBe('(ih-oh)/2')
		expect(f.getKeepAspect()).toBe(false)
		expect(f.getExact()).toBe(false)
	})

	test('string with 2 parameters', () => {
		const f = new CropFilter('320:180')
		expect(f.getWidth()).toBe(320)
		expect(f.getHeight()).toBe(180)
		expect(f.getCropX()).toBe('(iw-ow)/2')
		expect(f.getCropY()).toBe('(ih-oh)/2')
		expect(f.getKeepAspect()).toBe(false)
		expect(f.getExact()).toBe(false)
	})

	test('string with 4 parameters', () => {
		const f = new CropFilter('320:180:0:0')
		expect(f.getWidth()).toBe(320)
		expect(f.getHeight()).toBe(180)
		expect(f.getCropX()).toBe(0)
		expect(f.getCropY()).toBe(0)
		expect(f.getKeepAspect()).toBe(false)
		expect(f.getExact()).toBe(false)
	})

	test('key=value pairs', () => {
		const f = new CropFilter('exact=1')
		expect(f.getWidth()).toBe('iw')
		expect(f.getHeight()).toBe('ih')
		expect(f.getCropX()).toBe('(iw-ow)/2')
		expect(f.getCropY()).toBe('(ih-oh)/2')
		expect(f.getKeepAspect()).toBe(false)
		expect(f.getExact()).toBe(true)
	})
})

describe('properties', () => {
	test('width', () => {
		const f = new CropFilter().width(320)
		expect(f.getWidth()).toBe(320)
	})

	test('height', () => {
		const f = new CropFilter().height(180)
		expect(f.getHeight()).toBe(180)
	})

	test('cropX', () => {
		const f = new CropFilter().cropX(0)
		expect(f.getCropX()).toBe(0)
	})

	test('cropY', () => {
		const f = new CropFilter().cropY(0)
		expect(f.getCropY()).toBe(0)
	})

	test('keepAspect', () => {
		const f = new CropFilter().keepAspect(true)
		expect(f.getKeepAspect()).toBe(true)
	})

	test('exact', () => {
		const f = new CropFilter().exact(true)
		expect(f.getExact()).toBe(true)
	})
})

describe('build', () => {
	test('build', () => {
		const f = new CropFilter()
		expect(f.build()).toBe('crop')
	})

	test('build with parameters', () => {
		const f = new CropFilter('320:180:0:0')
		expect(f.build()).toBe('crop=320:180:0:0')
	})

	test('build with exact', () => {
		const f = new CropFilter('exact=1')
		expect(f.build()).toBe('crop=exact=1')
	})
})
