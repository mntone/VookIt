import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { IsIn, Length, MaxLength } from 'class-validator'

import env from '../../../../../constants/env.js'

export class EditDto {
	@ApiProperty({
		description: 'The title of post',
		type: String,
	})
	@Length(env.titleLength.min, env.titleLength.max, {
		message: args => {
			const value = args.value ? args.value.length : 0
			let conditionMessage
			if (value === 0) {
				conditionMessage = 'empty'
			} else if (value < env.titleLength.min) {
				conditionMessage = 'too short'
			} else {
				conditionMessage = 'too long'
			}
			return `The ${args.property} is ${conditionMessage}. Its length should be betweet ${args.constraints[0]} and ${args.constraints[1]}, but actual length is ${value}.`
		},
	})
	readonly title!: string

	@ApiProperty({
		description: 'The description of post',
		type: String,
	})
	@MaxLength(env.descriptionMaximumLength, {
		message: 'The $property is too long. Its length should be up to $constraint1 characters, but actual length is $value.',
	})
	readonly description!: string

	@ApiProperty({
		description: 'The visibility of post',
		enum: ['private', 'public'],
	})
	@IsIn(['private', 'public'], {
		message: 'The $property is invalid value. It should be either "private" or "public".',
	})
	readonly visibility!: string
}

export class PatchableEditDto extends PartialType(EditDto) { }
