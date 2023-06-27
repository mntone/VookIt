const { createHash } = require('crypto')
const { createReadStream } = require('fs')

/**
 * Get file hash as hex string.
 * @param   {string}                algorithm Hash algorithm
 * @param   {import('fs').PathLike} filepath  File path
 * @param   {'hex'|'base64'}        encoding
 * @returns {Promise<string>}                 Hash as encoding string
 */
function getFileHash(algorithm, filepath, encoding = 'base64') {
	return new Promise((resolve, reject) => {
		const hashfunc = createHash(algorithm)
			.setEncoding(encoding)
			.once('finish', () => resolve(hashfunc.read()))
		createReadStream(filepath)
			.once('error', err => reject(err))
			.pipe(hashfunc)
	})
}

module.exports = {
	getFileHash,
}
