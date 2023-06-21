/* eslint-disable import/order */
const { validationResult } = require('express-validator')
const express = require('express')

const { cachecontrol, nostore } = require('../../utils/express/cachecontrol')
const { numToUsid } = require('../../../utils/IdSupport')
const msgpack = require('../../utils/express/msgpack')
const prefer = require('../../utils/express/prefer')
const validators = require('../../utils/express/validators')

// Load environment constants
const env = require('../../../constants/env')

// Load usecases
const createPost = require('../../usecase/posts/create')
const version = require('../../usecase/version')

// Load routers
const upload = require('./upload')

// Init a router
const router = express
	.Router({
		strict: true,
	})
	.use(msgpack)
	.use(prefer)
	.use(upload)

const createError = require('http-errors')
/**
 * @param req
 * @param _
 * @param next
 */
function autoValidation(req, _, next) {
	const result = validationResult(req)
	if (!result.isEmpty()) {
		const err = createError(422, result.array()[0].msg)
		next(err)
		return
	}

	next()
}

// Add a post.
//
// [Endpoints]
// - GET /post:format?
router.post(
	'/post:format?',
	express.urlencoded({
		extended: true,
		limit: env.requestMaxBodySize,
	}),
	require('../../schemas/api/post'),
	autoValidation,
	nostore,
	async (req, res) => {
		const format = req.params.format
		const uuid = req.body.uuid
		const title = req.body.title
		const description = req.body.description
		const body = await createPost(uuid, 'dev', title, description)
		if (format === '.html') {
			res.redirect(302, '/v/' + numToUsid(body.id))
		} else {
			res.select(format, body)
		}
	})

// Get app info.
//
// [Endpoints]
// - GET /version:format?
const versioncc = cachecontrol({
	maxAge: env.apiVersionCacheTerms,
	immutable: true,
})
router.get(
	'/version:format?',
	validators.param.formatWithHtml,
	versioncc,
	(req, res) => {
		const format = req.params.format
		const body = version()
		res.select(format, body)
	})

// Handle error.
router.use((err, req, res, next) => {
	if (err.status) {
		const body = {
			status: err.status,
		}

		if (err.message) {
			body.reason = err.message
		}

		return res.select(req.params.format, body)
	} else {
		return next(err)
	}
})

module.exports = router
