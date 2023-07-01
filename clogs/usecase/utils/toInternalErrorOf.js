const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library')

const InternalError = require('../InternalError')

/**
 *
 * @param   {string}               errorName
 * @param   {number}               statusCode
 * @returns {(err: Error) => void}
 */
function toInternalErrorOf(errorName, statusCode) {
	return err => {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new InternalError(errorName, statusCode)
		}
		throw err
	}
}

module.exports = toInternalErrorOf
