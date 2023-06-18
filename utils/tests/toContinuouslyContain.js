const isEqual = require('lodash.isequal')

// eslint-disable-next-line jsdoc/require-jsdoc
function toContinuouslyContain(actual, expected) {
	const pass = actual
		.reduce((a, _, currentIndex, original) => {
			if (currentIndex >= expected.length - 1) {
				const children = Array.from(
					{ length: expected.length },
					(_, i) => original[currentIndex - (expected.length - i - 1)])
				a.push(children)
			}
			return a
		}, [])
		.some(elem => isEqual(elem, expected))
	if (pass) {
		return {
			message: () => `expected ${this.utils.printReceived(actual)} to continuously contain ${this.utils.printExpected(expected)}.`,
			pass: true,
		}
	} else {
		return {
			message: () => `expected ${this.utils.printReceived(actual)} not to continuously contain ${this.utils.printExpected(expected)}.`,
			pass: false,
		}
	}
}

module.exports = toContinuouslyContain
