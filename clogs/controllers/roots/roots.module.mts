import { Module } from '@nestjs/common'

import { FindPostByIdUseCase } from '../../usecase/posts/findById.mjs'
import { FindPostsUseCase } from '../../usecase/posts/findMany.mjs'

import { RootController } from './roots.controller.mjs'

@Module({
	controllers: [RootController],
	providers: [
		FindPostsUseCase,
		FindPostByIdUseCase,
	],
})
export class RootModule { }
