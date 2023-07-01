const express = require('express')
const createError = require('http-errors')

const env = require('../../../constants/env')
const { addSIPrefix } = require('../../../utils/DataSizeSupport')
const chunkUploadInitCoordinate = require('../../coordinates/api/upload/chunk/init')
const chunkUploadMergeCoordinate = require('../../coordinates/api/upload/chunk/merge')
const chunkUploadSendCoordinate = require('../../coordinates/api/upload/chunk/send')
const uploadCoordinate = require('../../coordinates/api/upload/default')
const info = require('../../usecase/uploads/info')
const { nostore } = require('../../utils/express/cachecontrol')
const validators = require('../../utils/express/validators')

// Init a router
const router = express
	.Router({
		strict: true,
	})
	.use(nostore) // Always write "Cache-Control: no-store"

/**
 *
 * @param maxSize
 * @param req
 * @param _
 * @param next
 */
function checkContentLength(maxSize, req, _, next) {
	const contentLength = req.headers['content-length']
	if (contentLength) {
		const estimatedLength = parseInt(contentLength, 10)
		if (estimatedLength > maxSize) {
			const friendly = addSIPrefix(maxSize)
			const err = createError(413, `The file exceeds the maximum size of ${friendly}Bytes.`)
			next(err)
			return
		}
	}

	next()
}

// Upload files (without chunk files).
router.post(
	'/upload:format',
	checkContentLength.bind(env.uploadMaxFileSize),
	uploadCoordinate.handlers,
)

// Init chunks.
router.post(
	'/upload/init:format?',
	chunkUploadInitCoordinate.handlers,
)

// Send chunks.
router.post(
	'/upload/send:format?',
	checkContentLength.bind(env.uploadMaxFileSize),
	chunkUploadSendCoordinate.handlers,
)

// Merge chunks.
router.post(
	'/upload/merge:format?',
	chunkUploadMergeCoordinate.handlers,
)

// Cancel chunks.
router.delete('/upload/:cuid:format?', (_, res) => {

})

// Get upload info.
//
// [Endpoints]
// - POST /upload/info
// - POST /upload/info.:format
router.get(
	'/upload/info:format?',
	validators.param.format,
	(req, res) => {
		const format = req.params.format
		const body = info()
		res.select(format, body)
	})

module.exports = router
