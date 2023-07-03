import { Module } from '@nestjs/common'

import { RootController } from './roots.controller.mjs'

@Module({
	controllers: [RootController],
})
export class RootModule { }
