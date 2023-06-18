const express = require('express')
const multiparty = require('multiparty')

const { nostore } = require('../../utils/express/cachecontrol')
const validators = require('../../utils/express/validators')
const { addSIPrefix } = require('../../../utils/DataSizeSupport')

// Load environment constants
const env = require('../../../constants/env')

// Load usecases
const create = require('../../usecase/uploads/create')
const info = require('../../usecase/uploads/info')

/**
 * Define multiparty options
 * @constant
 * @type {multiparty.FormOptions}
 */
const multipartyOptions = Object.freeze({
	maxFieldsSize: 0,
	maxFilesSize: env.uploadMaxFileSize,
})

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

/**
 *
 * @param err
 * @param assistSize
 * @param format
 */
function convertMultiparyError(err, assistSize, format) {
	let properties
	if (format === '.json' || format === '.msgpack') {
		properties = { format }
	} else {
		properties = {}
	}

	let ret
	switch (err.message) {
	case 'maximum file length exceeded': {
		const friendly = addSIPrefix(assistSize)
		ret = createError(err.status, `The file exceeds the maximum size of ${friendly}Bytes.`, properties)
		break
	}
	default:
		ret = createError(err.status, err.message, properties)
		break
	}
	return ret
}

// Init chunk upload system.
//
// [Endpoints]
// - POST /upload:format?
router.post(
	'/upload:format',
	validators.param.formatWithHtml,
	checkContentLength.bind(env.uploadMaxFileSize),
	(req, res, next) => {
		const format = req.params.format
		const form = new multiparty.Form(multipartyOptions)
		form.parse(req, async (err, _, files) => {
			if (err) {
				next(convertMultiparyError(err, env.uploadMaxFileSize, format))
				return
			}

			if (files['file'] && files['file'].length === 1) {
				const body = await create(files['file'][0])
				if (format === '.html') {
					res.redirect(302, '/post/' + body.uuid)
				} else {
					res.select(format, body)
				}
			} else {
				// [TODO] handling error
				res.sendStatus(500)
			}
		})
	})

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
