import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsPositive, Length, Max } from 'class-validator'

import env from '../../../../../constants/env.js'
import { IsHashData } from '../../../../utils/decorators/IsHashData.mjs'
// import { addSIPrefix } from '../../../../../utils/DataSizeSupport.js'

export class InitDto {
	@ApiProperty({
		type: String,
		description: 'The file name to upload',
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
	readonly name!: string

	@ApiProperty({
		type: Number,
		description: 'The file size to upload',
	})
	@Transform(params => Number(params.value))
	@IsPositive({
		message: 'The file size is invalid.',
	})
	// @Max(env.uploadMaxChunkSize as unknown as number, {
	// 	message: `The file size is too large. It should be less than or equal to ${addSIPrefix(env.uploadMaxChunkSize as unknown as number)}B`,
	// })
	readonly size!: number

	@ApiProperty({
		type: String,
		description: 'The hash of file to upload with hash algorithm name',
	})
	@IsHashData({
		message: 'The file hash is invalid.',
	})
	readonly hash!: string
}
