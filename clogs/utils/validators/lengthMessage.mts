import { ValidationArguments } from 'class-validator'

export function getLengthMessage(args: ValidationArguments) {
	const value = args.value ? args.value.length : 0
	let conditionMessage
	if (value === 0) {
		conditionMessage = 'empty'
	} else if (value < args.constraints[0]) {
		conditionMessage = 'too short'
	} else {
		conditionMessage = 'too long'
	}
	return `The ${args.property} is ${conditionMessage}. Its length should be betweet ${args.constraints[0]} and ${args.constraints[1]}, but actual length is ${value}.`
}
