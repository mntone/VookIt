import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Allow, IsInt, Length } from 'class-validator'

export class SendDto {
	@ApiProperty({
		type: String,
		description: 'The current cuid',
	})
	@Length(25, 25, {
		message: 'The cuid is invalid length. It should be 25 characters.',
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
	@Length(51, 95, {
		message: 'The hash of a part of chunked file is invalid length. It should be betweet 51 and 95 characters.',
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
