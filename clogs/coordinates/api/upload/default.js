const createError = require('http-errors')
const { Form } = require('multiparty')

const env = require('../../../../constants/env')
const { addSIPrefix } = require('../../../../utils/DataSizeSupport')
const scheme = require('../../../schemas/api/upload/default')
const InternalError = require('../../../usecase/InternalError')
const createUpload = require('../../../usecase/uploads/create')
const { cachecontrol } = require('../../../utils/express/cachecontrol')
const { numToUsid } = require('../../../utils/IdSupport')
const ResponseBuilder = require('../../utils/ResponseBuilder')

/**
 * Define multiparty options.
 * @constant
 * @type {import('multiparty').FormOptions}
 */
const multipartyOptions = Object.freeze({
	maxFieldsSize: 0,
	maxFilesSize: env.uploadMaxFileSize,
})

class UploadDefaultResponseBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	_onNext(req, res, next) {
		const form = new Form(multipartyOptions)
		form.parse(req, async (err, fields, files) => {
			if (err) {
				if (err.message === 'maximum file length exceeded') {
					const friendly = addSIPrefix(env.uploadMaxFileSize)
					const newErr = createError(413, `The file exceeds the maximum size of ${friendly}Bytes.`)
					next(newErr)
				} else {
					const newErr = createError(400, err.message)
					next(newErr)
				}
				return
			}

			if (!fields.hash || fields.hash.length !== 1) {
				throw new InternalError('upload.nohash', 400)
			}

			const filesInFile = files['file']
			if (!filesInFile || filesInFile.length !== 1) {
				throw new InternalError('upload.nofile', 400)
			}

			const hashdata = fields.hash[0]
			const file = filesInFile[0]
			const post = await createUpload(hashdata, file, 'dev')
			const format = req.params.format
			if (format === '.html') {
				const usid = numToUsid(post.id)
				res.redirect(302, '/e/' + usid)
			} else {
				res.select(format, post)
			}
		})
	}

	get _scheme() {
		return scheme
	}

	get handlers() {
		const baseHandlers = super.handlers
		baseHandlers.splice(-1, 0, cachecontrol({
			private: true,
			noStore: true,
		}))
		return baseHandlers
	}
}

module.exports = new UploadDefaultResponseBuilder()
