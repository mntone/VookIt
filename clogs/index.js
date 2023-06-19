const express = require('express')

const env = require('../constants/env')
const initConstants = require('../constants/init')

// Init constants.
initConstants()

// Import routers.
const html = require('./routes/html/index')
const rest = require('./routes/rest/index')

// Connect routers.
const app = express()
app.use('/', html)
app.use('/api', rest)

// Deploy static assets.
if (env.staticDeployEnabled) {
	// Add MimeType
	express.static.mime.define({ 'image/avif': ['avif'] })

	// Style and script files.
	app.use('/a', express.static('./.assets'))

	// Media files.
	if (process.env.NODE_ENV !== 'development') {
		app.use(env.mediaForbiddenPath, (_, res) => res.sendStatus(404))
		app.use(env.mediaRootPath, express.static(env.mediaDir))
	} else {
		app.use(env.mediaRootPath, express.static(env.mediaDir, { dotfiles: 'allow' }))
	}
}

// Stand-by.
app.listen(80)
