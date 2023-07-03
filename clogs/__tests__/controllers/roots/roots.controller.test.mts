import { Test, TestingModule } from '@nestjs/testing'

import { RootController } from '../../../controllers/roots/roots.controller.mjs'
import { RootModule } from '../../../controllers/roots/roots.module.mjs'

describe('RootController', () => {
	let controller: RootController

	beforeEach(async() => {
		const root: TestingModule = await Test.createTestingModule({
			controllers: [RootController],
			providers: [RootModule],
		}).compile()

		controller = root.get<RootController>(RootController)
	})

	describe('upload', () => {
		test('should return null', () => {
			expect(controller.upload()).toBe(null)
		})
	})
})
