const { createHash } = require('crypto')
const { createReadStream } = require('fs')

/**
 * Get file hash as hex string.
 * @param   {string}                algorithm Hash algorithm
 * @param   {import('fs').PathLike} filepath  File path
 * @returns {Promise<string>}                 Hash as hex string
 */
function getFileHash(algorithm, filepath) {
	return new Promise((resolve, reject) => {
		const hashfunc = createHash(algorithm)
			.setEncoding('hex')
			.once('finish', () => resolve(hashfunc.read()))
		createReadStream(filepath)
			.once('error', err => reject(err))
			.pipe(hashfunc)
	})
}

module.exports = {
	getFileHash,
}
