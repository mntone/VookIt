import { Module } from '@nestjs/common'

import { UpdatePostUseCase } from '../../../usecase/posts/update.mjs'

import { PostController } from './posts.controller.mjs'

@Module({
	controllers: [PostController],
	providers: [
		UpdatePostUseCase,
	],
})
export class PostModule { }
