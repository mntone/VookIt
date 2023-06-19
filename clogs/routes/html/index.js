const express = require('express')
const i18next = require('i18next')
const i18nextFsBackend = require('i18next-fs-backend')
const i18nextMiddleware = require('i18next-http-middleware')
const jsx = require('node-jsx')
const path = require('path')
const { initReactI18next } = require('react-i18next')

const { toId } = require('../../../utils/IdSupport')
const validators = require('../../utils/express/validators')

// Init i18n
i18next
	.use(i18nextFsBackend)
	.use(i18nextMiddleware.LanguageDetector)
	.use(initReactI18next)
	.init({
		backend: {
			loadPath: path.join(process.cwd(), 'clogs/locales/{{lng}}.yaml'),
		},
		fallbackLng: 'en',
	})

// Init JSX
jsx.install({
	extension: '.jsx',
})

const { error, top, post, upload, view } = require('../../coordinates/index')

const router = express
	.Router({
		strict: true,
	})
	.use(i18nextMiddleware.handle(i18next))

const { validationResult } = require('express-validator')
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

router.get(
	'/',
	express.urlencoded({ extended: true }),
	require('../../schemas/index'),
	autoValidation,
	(req, res) => {
		const options = {}
		if (req.query.until) {
			options.untilDate = new Date(Number(req.query.until))
		}
		top(req, res, options)
	})

router.get(
	'/v/:id',
	require('../../schemas/view/:id'),
	autoValidation,
	(req, res) => {
		const id = toId(req.params.id)
		view(id, req, res)
	})

router.get(
	'/post/:uuid',
	validators.param.uuid,
	(req, res) => post(req.params.uuid, req, res))

router.use('/upload', (req, res) => upload(req, res))

// Handle error.
router.use((err, req, res, next) => {
	if (err.status) {
		let description = req.t('errorpage.message').replace('%d', err.status ?? 500)
		if (err.message) {
			description = req.t(err.message) + ' (' + description + ')'
		} else {
			description = req.t('errorpage.message').replace('%d', err.status ?? 500)
		}
		error(description, req, res)
	} else {
		return next(err)
	}
})

module.exports = router
