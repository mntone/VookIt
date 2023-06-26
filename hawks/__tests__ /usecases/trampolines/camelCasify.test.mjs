/* eslint-disable camelcase */

import { camelCasify } from '../../../usecases/trampolines/camelCasify.util'

describe('camelCasify', () => {
	test.each([
		[{
			super_hyper_master: 1,
			children: {
				super_hyper_master: 1,
			},
			array: [{
				super_hyper_master: 1,
			}],
		}, {
			superHyperMaster: 1,
			children: {
				superHyperMaster: 1,
			},
			array: [{
				superHyperMaster: 1,
			}],
		}],
		[[
			{ super_hyper_master: 1 },
			{ unmarked_pro_max_ultra_extreeeeeeeeeeeeme: Infinity },
		], [
			{ superHyperMaster: 1 },
			{ unmarkedProMaxUltraExtreeeeeeeeeeeeme: Infinity },
		]],
	])('%s', (o, e) => {
		const t = camelCasify(o)
		expect(t).toMatchObject(e)
	})
})
