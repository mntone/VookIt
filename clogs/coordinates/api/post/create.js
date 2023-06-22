const { urlencoded } = require('express')

const env = require('../../../../constants/env')
const { numToUsid } = require('../../../../utils/IdSupport')
const scheme = require('../../../schemas/api/post')
const createPost = require('../../../usecase/posts/create')
const { cachecontrol } = require('../../../utils/express/cachecontrol')
const ResponseBuilder = require('../../utils/ResponseBuilder')

class PostDefaultResponseBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Request}  req
	 * @param {import('express').Response} res
	 */
	async _onNext(req, res) {
		const {
			uuid,
			title,
			description,
			// visibility,
		} = req.body

		const post = await createPost(uuid, 'dev', title, description)
		const format = req.params.format
		if (format === '.html') {
			res.redirect(302, '/v/' + numToUsid(post.id))
		} else {
			res.select(format, post)
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
			parameterLimit: 4,
		}))
		baseHandlers.splice(-1, 0, cachecontrol({
			private: true,
			noStore: true,
		}))
		return baseHandlers
	}
}

module.exports = new PostDefaultResponseBuilder()
