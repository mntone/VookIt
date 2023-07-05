import { ApiProperty } from '@nestjs/swagger'
import { Allow } from 'class-validator'

import { IsHashData } from '../../../../utils/decorators/IsHashData.mjs'
import { FileData } from '../../../../utils/interceptors/file.interceptor.mjs'

export class SendFileDto {
	@ApiProperty({
		type: String,
		description: 'The hash of file to upload with hash algorithm name',
	})
	@IsHashData({
		message: 'The file hash is invalid.',
	})
	readonly hash!: string

	@ApiProperty({
		type: Object,
		name: 'file',
		description: 'The a part of chunked file',
	})
	@Allow()
	readonly file!: FileData
}
