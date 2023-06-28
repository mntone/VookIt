const constants = require('../../../constants/env')

/**
 * @typedef UploadChunkInfo
 * @property {string} each
 * @property {string} file
 * @property {number} parallels
 */

/**
 * @typedef UploadInfo
 * @property {UploadChunkInfo} chunk
 * @property {number}          slot
 */

/**
 * Get upload info.
 * @returns {UploadInfo}
 */
module.exports = () => {
	// [TODO] get current slot
	return {
		chunk: {
			each: constants.uploadChunkSize,
			file: constants.uploadMaxFileSize,
			parallels: constants.uploadMaxParallelsPerUpload,
		},
		slot: 0 /* dummy */,
	}
}
