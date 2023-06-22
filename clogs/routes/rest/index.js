const express = require('express')

const env = require('../../../constants/env')
const postCreateCoordinate = require('../../coordinates/api/post/create')
const postUpdateCoordinate = require('../../coordinates/api/post/update')
const postUpdateHtmlCoordinate = require('../../coordinates/api/post/update.html')
const version = require('../../usecase/version')
const { cachecontrol } = require('../../utils/express/cachecontrol')
const msgpack = require('../../utils/express/msgpack')
const prefer = require('../../utils/express/prefer')
const validators = require('../../utils/express/validators')

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

// Add a post.
//
// [Endpoints]
// - POST /post:format? (format='.msgpack'|'.json'|'.html')
router.post('/post:format?', postCreateCoordinate.handlers)

// Update a post.
//
// [Endpoints]
// - PATCH /post/:id:format? (format='.msgpack'|'.json')
// - POST  /post/:id.html
router.patch('/post/:id:format?', postUpdateCoordinate.handlers)
router.post('/post/:id.html', postUpdateHtmlCoordinate.handlers)

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
