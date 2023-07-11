import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, Length } from 'class-validator'

import env from '../../../../constants/env.js'
import { getLengthMessage } from '../../../utils/validators/lengthMessage.mjs'

export class SignInDto {
	@ApiProperty({
		description: 'The Screen Name of User',
		type: String,
	})
	@Length(env.screennameMinimumLength, env.screennameMaximumLength, {
		message: getLengthMessage,
	})
	readonly screenname!: string

	@ApiProperty({
		description: 'The password of User',
		type: String,
	})
	@Length(env.passwordMinimumLength, env.passwordMaximumLength, {
		message: getLengthMessage,
	})
	readonly password!: string

	@ApiProperty({
		description: 'The redirect relative uri',
		type: String,
	})
	@IsOptional()
	readonly redirect?: string
}
