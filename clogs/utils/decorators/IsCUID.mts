import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator'

import isCUID from '../validators/isCUID.js'

export const IS_CUID = 'isCUID'

export function IsCUID(
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return ValidateBy(
		{
			name: IS_CUID,
			validator: {
				validate: (value): boolean => isCUID(value),
				defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a CUID', validationOptions),
			},
		},
		validationOptions,
	)
}
