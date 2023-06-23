const { stat } = require('fs/promises')
const { join } = require('path')
const { URL } = require('url')

const mime = require('mime')
const serveStatic = require('serve-static')

class CompressionExpress {
	#root
	#nextHandler
	#compressions = []
	#cache = {}

	constructor(root, options) {
		options = options || { enableBrotli: true }

		this.#root = root
		this.#nextHandler = serveStatic(root, options)

		if (options.enableBrotli) {
			this.registerCompression('br', '.br')
		}
		this.registerCompression('gzip', '.gz')
	}

	/**
	 * @param   {import('express').Request}             req
	 * @param   {import('express').Response}            res
	 * @param   {import('express').NextFunction}        next
	 * @returns {import('serve-static').RequestHandler}
	 */
	async onNext(req, res, next) {
		const acceptEncoding = req.header('accept-encoding')
		if (acceptEncoding) {
			for (const compression of this.#compressions) {
				if (acceptEncoding.indexOf(compression.encodingName) !== -1) {
					const path = req.path
					if (!this.#cache[path]) {
						this.#cache[path] = {}
					}

					const enabled = this.#cache[path][compression.encodingName]
					if (enabled === false) {
						continue
					}

					if (enabled !== true) {
						try {
							const real = join(this.#root, path + compression.fileExtension)
							const stats = await stat(real)
							if (stats.isDirectory()) {
								this.#cache[path][compression.encodingName] = false
								continue
							}
							this.#cache[path][compression.encodingName] = true
						} catch (err) {
							this.#cache[path][compression.encodingName] = false
							continue
						}
					}

					const type = mime.lookup(path)
					const charset = mime.charsets.lookup(type)
					const url = new URL(req.url, 'relative:///')
					req.url = url.pathname + compression.fileExtension + url.search
					res
						.set('Content-Encoding', compression.encodingName)
						.set('Content-Type', charset ? `${type}; charset=${charset}` : type)
						.set('Vary', 'Accept-Encoding')
				}
			}
		}
		return this.#nextHandler(req, res, next)
	}

	/**
	 * Register new compression.
	 * @param {string} encodingName
	 * @param {string} fileExtension
	 */
	registerCompression(encodingName, fileExtension) {
		const index = this.#compressions.findIndex(compression => compression.encodingName === encodingName)
		if (index !== -1) {
			this.#compressions[index].fileExtension = fileExtension
		} else {
			this.#compressions.push({
				encodingName,
				fileExtension,
			})
		}
	}
}

/**
 * @param   {string}                                     root
 * @param   {import('serve-static').ServeStaticOptions?} options
 * @returns {import('express').RequestHandler}
 */
function staticCompression(root, options) {
	const compression = new CompressionExpress(root, options)
	return compression.onNext.bind(compression)
}

module.exports = staticCompression
