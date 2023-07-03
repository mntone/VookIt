import { Module } from '@nestjs/common'

import { UploadController } from './uploads.controller.mjs'

@Module({
	controllers: [UploadController],
})
export class UploadModule { }
