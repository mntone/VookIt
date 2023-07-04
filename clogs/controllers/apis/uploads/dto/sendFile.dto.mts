import { ApiProperty } from '@nestjs/swagger'
import { Allow } from 'class-validator'

import { IsHashData } from '../../../../utils/decorators/IsHashData.mjs'

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
		type: Buffer,
		name: 'file',
		description: 'The a part of chunked file',
	})
	@Allow()
	readonly file!: Buffer
}
