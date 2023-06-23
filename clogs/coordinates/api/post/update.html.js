const { urlencoded } = require('express')

const env = require('../../../../constants/env')
const { numToUsid, toIdAsNumber } = require('../../../../utils/IdSupport')
const scheme = require('../../../schemas/api/post/update.html')
const updatePost = require('../../../usecase/posts/update')
const { cachecontrol } = require('../../../utils/express/cachecontrol')
const ResponseBuilder = require('../../utils/ResponseBuilder')

class PostUpdateResponseBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async _onNext(req, res) {
		const usid = req.params.id
		const id = toIdAsNumber(usid)
		const post = await updatePost(id, req.body)
		res.redirect(302, '/v/' + numToUsid(post.id))
	}

	get _scheme() {
		return scheme
	}

	get handlers() {
		const baseHandlers = super.handlers
		baseHandlers.unshift(urlencoded({
			extended: false,
			limit: env.requestMaxBodySize,
			parameterLimit: 4,
		}))
		baseHandlers.splice(-1, 0, cachecontrol({
			private: true,
			noStore: true,
		}))
		return baseHandlers
	}
}

module.exports = new PostUpdateResponseBuilder()
