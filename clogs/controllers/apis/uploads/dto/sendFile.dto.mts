import { ApiProperty } from '@nestjs/swagger'
import { Allow, Length } from 'class-validator'

export class SendFileDto {
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
		name: 'file',
		description: 'The a part of chunked file',
	})
	@Allow()
	readonly file!: Buffer
}
