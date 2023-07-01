const { urlencoded } = require('express')

const env = require('../../../../../constants/env')
const scheme = require('../../../../schemas/api/upload/chunk/init')
const createChunk = require('../../../../usecase/uploads/chunks/create')
const { cachecontrol } = require('../../../../utils/express/cachecontrol')
const ResponseBuilder = require('../../../utils/ResponseBuilder')

/**
 * Define selection
 * @type {import('@prisma/client').Prisma.UploadSelect}
 */
const select = {
	cuid: true,
	startedAt: true,
}

class InitChunkUploadResponseBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async _onNext(req, res) {
		const upload = await createChunk(
			req.body.name,
			req.body.size,
			req.body.hash,
			{ select },
		)
		const format = req.params.format
		res.select(format, upload)
	}

	get _scheme() {
		return scheme
	}

	get handlers() {
		const baseHandlers = super.handlers
		baseHandlers.unshift(urlencoded({
			extended: false,
			limit: env.requestMaxBodySize,
			parameterLimit: 3,
		}))
		baseHandlers.splice(-1, 0, cachecontrol({
			private: true,
			noStore: true,
		}))
		return baseHandlers
	}
}

module.exports = new InitChunkUploadResponseBuilder()
