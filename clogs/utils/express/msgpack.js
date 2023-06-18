const { encode } = require('@msgpack/msgpack')
const db = require('mime-db')

// Add msgpack mime to mime-db
db['application/msgpack'] = {
	source: 'iana',
	extensions: ['msgpack'],
}

/**
 * @param   {object}                           obj
 * @returns {import('express').RequestHandler}
 */
function msgpack(obj) {
	const body = encode(obj)

	if (!this.get('Content-Type')) {
		this.set('Content-Type', 'application/msgpack')
	}

	return this.send(body)
}

/**
 *
 * @param                                  _
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
function install(_, res, next) {
	res.msgpack = msgpack
	next()
}

module.exports = install
