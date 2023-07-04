import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator'

import { isHashData } from '../validators/isHashData.mjs'

export const IS_HASHDATA = 'isHashData'

export function IsHashData(
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return ValidateBy(
		{
			name: IS_HASHDATA,
			validator: {
				validate: (value): boolean => isHashData(value),
				defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be base64 encoded hash with hash algorithm name', validationOptions),
			},
		},
		validationOptions,
	)
}
