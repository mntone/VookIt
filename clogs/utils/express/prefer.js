/**
 * @param   {object}                           obj
 * @returns {import('express').RequestHandler}
 */
function prefer(obj) {
	return this.format({
		'text/plain': () => {
			const readableJson = JSON.stringify(obj, null, '  ')

			if (!this.get('Content-Type')) {
				this.set('Content-Type', 'text/plain')
			}

			return this.send(readableJson)
		},

		'application/json': () => this.json(obj),

		default: () => this.msgpack(obj),
	})
}

/**
 * @param   {'.json'|'.msgpack'}               format
 * @param   {object}                           obj
 * @returns {import('express').RequestHandler}
 */
function select(format, obj) {
	if (format === '.msgpack') {
		return this.msgpack(obj)
	} else if (format === '.json') {
		return this.json(obj)
	} else {
		return this.prefer(obj)
	}
}

/**
 * @param                                  _
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
function install(_, res, next) {
	res.prefer = prefer
	res.select = select
	next()
}

module.exports = install
