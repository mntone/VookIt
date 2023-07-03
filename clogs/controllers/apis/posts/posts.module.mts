import { Module } from '@nestjs/common'

import { PostController } from './posts.controller.mjs'

@Module({
	controllers: [PostController],
})
export class PostModule { }
