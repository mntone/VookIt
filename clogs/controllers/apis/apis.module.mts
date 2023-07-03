import { Module } from '@nestjs/common'

import { ApisController } from './apis.controller.mjs'
import { PostModule } from './posts/posts.module.mjs'
import { UploadModule } from './uploads/uploads.module.mjs'

@Module({
	imports: [
		PostModule,
		UploadModule,
	],
	controllers: [ApisController],
})
export class ApisModule { }
