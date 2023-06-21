const createError = require('http-errors')
const { Form } = require('multiparty')

const env = require('../../../../constants/env')
const { addSIPrefix } = require('../../../../utils/DataSizeSupport')
const scheme = require('../../../schemas/api/upload/default')
const createUpload = require('../../../usecase/uploads/create')
const ResponseBuilder = require('../../utils/ResponseBuilder')

/**
 * Define multiparty options
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
		form.parse(req, async (err, _, files) => {
			if (err) {
				if (err.message === 'maximum file length exceeded') {
					const friendly = addSIPrefix(env.uploadMaxFileSize)
					const err = createError(413, `The file exceeds the maximum size of ${friendly}Bytes.`)
					next(err)
				} else {
					const err = createError(400, err.message)
					next(err)
				}
				return
			}

			if (files['file']) {
				if (files['file'].length === 1) {
					const body = await createUpload(files['file'][0])
					const format = req.params.format
					if (format === '.html') {
						res.redirect(302, '/post/' + body.uuid)
					} else {
						res.select(format, body)
					}
				} else {
					const err = createError(400, 'error.file')
					next(err)
				}
			} else {
				const err = createError(400, 'error.file')
				next(err)
			}
		})
	}

	get _scheme() {
		return scheme
	}
}

module.exports = new UploadDefaultResponseBuilder()
