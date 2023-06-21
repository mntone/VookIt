const path = require('path')

const express = require('express')
const i18next = require('i18next')
const i18nextFsBackend = require('i18next-fs-backend')
const i18nextMiddleware = require('i18next-http-middleware')
const jsx = require('node-jsx')
const { initReactI18next } = require('react-i18next')

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

router.get(
	'/',
	express.urlencoded({ extended: true }),
	top.handlers)

router.get('/v/:id', view.handlers)

router.get('/post/:uuid', post.handlers)

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
