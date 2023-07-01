const { existsSync } = require('fs')
const { mkdir } = require('fs/promises')
const { join, extname } = require('path')

const env = require('../../../constants/env')
const { numToUsid } = require('../../utils/IdSupport')
const InternalError = require('../InternalError')

const errors = {
	notfound: 'upload.notfound',
	internal: 'upload.internal',
}

/**
 * Get preferred filename.
 * @param   {string} original Original filename
 * @param   {string} ext      File extension
 * @returns {string}          Preferred filename
 */
function getPreferredFilename(original, ext) {
	let preferred
	if (env.uploadDeleteOriginalFilename) {
		preferred = 'video' + (ext ?? extname(original))
	} else {
		preferred = original
	}
	return preferred
}

/**
 * Exists temporary upload directory.
 * @param   {string} cuid
 * @returns {string}      Upload temporary directory path
 */
function existsTemporaryUploadDir(cuid) {
	const uploadDir = join(env.uploadWorkdir, cuid)
	if (!existsSync(uploadDir)) {
		throw new InternalError(errors.notfound, 404)
	}
	return uploadDir
}

/**
 * Get upload path. Create if not exist target directory.
 * @param   {number} id
 * @param   {string} ext
 * @returns {string}     Upload path
 */
async function getOrCreateUploadPath(id, ext) {
	const usid = numToUsid(id)
	const uploadDir = join(env.mediaOutputDir, usid)
	try {
		await mkdir(uploadDir)
	} catch (err) {
		throw new InternalError(errors.internal, 500, err)
	}

	const uploadPath = join(uploadDir, env.mediaOriginalFilename.replace('[ext]', ext))
	return uploadPath
}

module.exports = {
	errors,
	getPreferredFilename,
	existsTemporaryUploadDir,
	getOrCreateUploadPath,
}
