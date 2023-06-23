const { readFileSync } = require('fs')
const { createServer } = require('https')

const express = require('express')

const staticCompression = require('./utils/express/compression')

const env = require('../constants/env')
const initConstants = require('../constants/init')

// Init constants.
initConstants()

// Import routers.
const bull = require('./routes/bull')
const html = require('./routes/html/index')
const rest = require('./routes/rest/index')

// Connect routers.
const app = express()
app.use('/', html)
app.use('/api', rest)
app.use('/bull', bull)

// Deploy static assets.
if (env.staticDeployEnabled) {
	const isProd = process.env.NODE_ENV !== 'development'

	// Add MimeType
	express.static.mime.define({ 'image/avif': ['avif'] })

	// Style and script files.
	app.use('/a', staticCompression('./.assets', { enableBrotli: true, immutable: isProd }))

	// Media files.
	if (isProd) {
		app.use(env.mediaForbiddenPath, (_, res) => res.sendStatus(404))
		app.use(env.mediaRootPath, express.static(env.mediaDir, { immutable: true }))
	} else {
		app.use(env.mediaRootPath, express.static(env.mediaDir, { dotfiles: 'allow' }))
	}
}

// Stand-by.
if (env.ssl) {
	createServer({
		key: readFileSync(env.sslKeyFile),
		cert: readFileSync(env.sslCertFile),
	}, app).listen(env.port)
} else {
	app.listen(env.port)
}
