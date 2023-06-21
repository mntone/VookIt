const express = require('express')

const env = require('../../../constants/env')
const { addSIPrefix } = require('../../../utils/DataSizeSupport')
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

// [TODO] better impl
const createError = require('http-errors')
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

// Init chunk upload system.
//
// [Endpoints]
// - POST /upload:format?
router.post(
	'/upload:format',
	checkContentLength.bind(env.uploadMaxFileSize),
	uploadCoordinate.handlers,
)

// Init chunk upload system.
//
// [Endpoints]
// - POST /upload/chunk/init:format?
/**
 *
 * @param req
 */
function initChunk(req) {
	const filesize = req.query.size
	const filehash = req.query.hash
	// [TODO] register upload task to usecase, and get uuid
	const body = { uuid: 'dummy', chunk: 0 }
	return body
}
router.post(
	'/upload/chunk/init:format?',
	validators.param.format,
	(req, res) => {
		const format = req.params.format
		const body = initChunk(req)
		res.select(format, body)
	})

router.post('/upload/chunk/:uuid/:id:format?', (req, res) => {

})

// Check chunk upload progress.
//
// [Endpoints]
// - POST /upload/chunk/:uuid:format?
router.post('/upload/chunk/:uuid:format?', (req, res) => {
	const format = req.params.format
	// [TODO] register upload task to usecase, and get uuid
	const body = { lacks: [0, 1, 2, 3, 4] }
	res.select(format, body)
})

// Cancel chunk upload.
//
// [Endpoints]
// - DELETE /chunk/:uuid:format?
router.delete('/upload/chunk/:uuid:format?', (_, res) => {

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
