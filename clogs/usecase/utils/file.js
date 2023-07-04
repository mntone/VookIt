const { createHash } = require('crypto')
const { createReadStream } = require('fs')
const { Readable } = require('stream')

const { isBase64 } = require('validator')

const InternalError = require('../../utils/errors/InternalError.js')

const errors = {
	unknownHashAlgorithm: 'upload.unknown_hash_algorithm',
	invalidHashFormat: 'upload.invalid_hash_format',
	invalidHash: 'upload.invalid_hash',
}

/**
 *
 * @param   {import('fs').PathLike}                 path
 * @param   {(rs: import('fs').ReadStream) => void} action
 * @returns {Promise<void>}
 */
function getReaderStreamAsPromise(path, action) {
	return new Promise((resolve, reject) => {
		const readerStream = createReadStream(path)
			.once('end', () => resolve())
			.once('error', err => reject(err))
		action(readerStream)
	})
}

/**
 * Get blob hash as string.
 * @param   {import('stream').ReadableStream} stream    Readable stream
 * @param   {'sha256' | 'sha384' | 'sha512'}  algorithm Hash algorithm
 * @param   {'hex'|'base64'}                  encoding
 * @returns {Promise<string>}                           Hash as encoding string
 */
function getBlobHash(stream, algorithm, encoding = 'base64') {
	return new Promise((resolve, reject) => {
		const hashfunc = createHash(algorithm)
			.setEncoding(encoding)
			.once('finish', () => resolve(hashfunc.read()))
		stream
			.once('error', err => reject(err))
			.pipe(hashfunc)
	})
}

/**
 * Get file hash as string.
 * @param   {import('fs').PathLike}          filepath  File path
 * @param   {'sha256' | 'sha384' | 'sha512'} algorithm Hash algorithm
 * @param   {'hex'|'base64'}                 encoding
 * @returns {Promise<string>}                          Hash as encoding string
 */
function getFileHash(filepath, algorithm, encoding = 'base64') {
	const readable = createReadStream(filepath)
	return getBlobHash(readable, algorithm, encoding)
}

const useAlgorithm = ['sha256', 'sha384', 'sha512']

/**
 * Is hash data
 * @param   {string}  hashdata Hash data string
 * @returns {boolean}          Is hash data
 */
function isHashData(hashdata) {
	const [algorithm, userhash] = hashdata.split('-', 2)
	return userhash && useAlgorithm.includes(algorithm) && isBase64(userhash)
}

/**
 *
 * @param {Buffer} buffer   Buffer
 * @param {string} hashdata Hash data
 */
async function compareBlobHash(buffer, hashdata) {
	const [algorithm, userhash] = hashdata.split('-', 2)
	if (!userhash) {
		throw new InternalError(errors.invalidHashFormat, 400)
	}
	if (!useAlgorithm.includes(algorithm)) {
		throw new InternalError(errors.unknownHashAlgorithm, 400)
	}
	if (!isBase64(userhash)) {
		throw new InternalError(errors.invalidHashFormat, 400)
	}

	const stream = Readable.from(buffer)
	const filehash = await getBlobHash(stream, algorithm)
	if (userhash !== filehash) {
		throw new InternalError(errors.invalidHash, 400)
	}
}

/**
 *
 * @param {import('fs').PathLike} filepath
 * @param {string}                hashdata
 */
async function compareFileHash(filepath, hashdata) {
	const [algorithm, userhash] = hashdata.split('-', 2)
	if (!userhash) {
		throw new InternalError(errors.invalidHashFormat, 400)
	}
	if (!useAlgorithm.includes(algorithm)) {
		throw new InternalError(errors.unknownHashAlgorithm, 400)
	}
	if (!isBase64(userhash)) {
		throw new InternalError(errors.invalidHashFormat, 400)
	}

	const filehash = await getFileHash(filepath, algorithm)
	if (userhash !== filehash) {
		throw new InternalError(errors.invalidHash, 400)
	}
}

module.exports = {
	errors,
	getReaderStreamAsPromise,
	getFileHash,
	isHashData,
	compareBlobHash,
	compareFileHash,
}
