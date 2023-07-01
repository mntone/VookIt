const { urlencoded } = require('express')

const env = require('../../../../../constants/env')
const scheme = require('../../../../schemas/api/upload/chunk/merge')
const mergeChunk = require('../../../../usecase/uploads/chunks/merge')
const { cachecontrol } = require('../../../../utils/express/cachecontrol')
const ResponseBuilder = require('../../../utils/ResponseBuilder')

class MergeChunkUploadResponseBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async _onNext(req, res) {
		const cuid = req.body.cuid
		const lacksOrPost = await mergeChunk(cuid, 'dev')
		const format = req.params.format
		if (Array.isArray(lacksOrPost)) {
			res.status(424).select(format, lacksOrPost)
		} else {
			res.select(format, lacksOrPost)
		}
	}

	get _scheme() {
		return scheme
	}

	get handlers() {
		const baseHandlers = super.handlers
		baseHandlers.unshift(urlencoded({
			extended: false,
			limit: env.requestMaxBodySize,
			parameterLimit: 1,
		}))
		baseHandlers.splice(-1, 0, cachecontrol({
			private: true,
			noStore: true,
		}))
		return baseHandlers
	}
}

module.exports = new MergeChunkUploadResponseBuilder()
