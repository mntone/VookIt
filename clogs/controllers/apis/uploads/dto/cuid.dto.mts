import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

export class CuidDto {
	@ApiProperty({
		type: String,
		description: 'The current cuid',
	})
	@Length(25, 25, {
		message: 'The cuid is invalid length. It should be 25 characters.',
	})
	readonly cuid!: string
}
