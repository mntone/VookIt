import { Module } from '@nestjs/common'

import { VersionUseCase } from '../../usecase/version.mjs'

import { ApisController } from './apis.controller.mjs'
import { PostModule } from './posts/posts.module.mjs'
import { UploadModule } from './uploads/uploads.module.mjs'

@Module({
	imports: [
		PostModule,
		UploadModule,
	],
	providers: [
		VersionUseCase,
	],
	controllers: [ApisController],
})
export class ApisModule { }
