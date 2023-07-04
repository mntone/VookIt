import { ApiProperty } from '@nestjs/swagger'

import { IsCUID } from '../../../../utils/decorators/IsCUID.mjs'

export class CuidDto {
	@ApiProperty({
		type: String,
		description: 'The current cuid',
	})
	@IsCUID({
		message: 'The cuid is invalid.',
	})
	readonly cuid!: string
}
