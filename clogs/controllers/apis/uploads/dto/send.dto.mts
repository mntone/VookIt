import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Allow, IsInt } from 'class-validator'

import { IsCUID } from '../../../../utils/decorators/IsCUID.mjs'
import { IsHashData } from '../../../../utils/decorators/IsHashData.mjs'

export class SendDto {
	@ApiProperty({
		type: String,
		description: 'The current cuid',
	})
	@IsCUID({
		message: 'The cuid is invalid.',
	})
	readonly cuid!: string

	@ApiProperty({
		type: Number,
		description: 'The index of a part of chunked file',
	})
	@Transform(params => Number(params.value))
	@IsInt({
		message: 'The index is invalid.',
	})
	readonly index!: number

	@ApiProperty({
		type: String,
		description: 'The a part of chunked file to upload with hash algorithm name',
	})
	@IsHashData({
		message: 'The file hash is invalid.',
	})
	readonly hash!: string

	@ApiProperty({
		type: Buffer,
		name: 'chunked_file',
		description: 'The a part of chunked file',
	})
	@Allow()
	// eslint-disable-next-line camelcase
	readonly chunked_file!: Buffer
}
