const { existsSync, mkdirSync } = require('fs')
const { mkdir } = require('fs/promises')
const { join } = require('path')

/**
 * @param   {import('fs').PathLike} path
 * @returns {Promise<void>}
 */
async function mkdirIfNeeded(path) {
	if (!existsSync(path)) {
		await mkdir(path, { recursive: true })
	}
}

/**
 * @param {import('fs').PathLike} path
 */
function mkdirSyncIfNeeded(path) {
	if (!existsSync(path)) {
		mkdirSync(path, { recursive: true })
	}
}

// Load environment constants.
const env = require('../constants/env')

/**
 * @param   {'audio'|'image'|'video'} type
 * @returns {string}
 */
function getMediaBaseDir(type) {
	return type === 'image' ? env.mediaImageDir : env.mediaEncodedDir
}

/**
 * @param   {'audio'|'image'|'video'} type
 * @param   {string}                  id
 * @returns {string}
 */
function getMediaFileDir(type, id) {
	const baseFiledir = getMediaBaseDir(type)
	const filedir = baseFiledir.replace('[id]', id)
	return filedir
}

/**
 * @param   {string}   ext
 * @param   {object[]} config
 * @param   {string}   config.idstr
 * @param   {string}   config.filename
 * @returns {string}
 */
function getPreferredMediaFileName(ext, config) {
	return config.filename ?? config.idstr + ext
}

/**
 * @param   {'audio'|'image'|'video'} type
 * @param   {string}                  id
 * @param   {string}                  filename
 * @returns {string}
 */
function existsMediaFile(type, id, filename) {
	const filedir = getMediaFileDir(type, id)
	const filepath = join(filedir, filename)
	const exists = existsSync(filepath)
	return exists
}

module.exports = {
	mkdirIfNeeded,
	mkdirSyncIfNeeded,

	getMediaBaseDir,
	getMediaFileDir,
	getPreferredMediaFileName,
	existsMediaFile,
}
