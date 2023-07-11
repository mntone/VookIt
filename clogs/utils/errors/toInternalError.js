const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library')

const InternalError = require('./InternalError.js')

/**
 *
 * @param   {string}                fieldName
 * @param   {number}                statusCode
 * @returns {(err: Error) => never}
 */
function toInternalError(fieldName, statusCode = 400) {
	return err => {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new InternalError(fieldName, statusCode)
		}
		throw err
	}
}

module.exports = {
	toInternalError,
}
