const createError = require('http-errors')
const { Form } = require('multiparty')
const { isHash } = require('validator')

const env = require('../../../../constants/env')
const { addSIPrefix } = require('../../../../utils/DataSizeSupport')
const scheme = require('../../../schemas/api/upload/default')
const createUpload = require('../../../usecase/uploads/create')
const { getFileHash } = require('../../utils/HashSupport')
const ResponseBuilder = require('../../utils/ResponseBuilder')

const useAlgorithm = ['sha256', 'sha384', 'sha512']

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
					const err = createError(413, `The file exceeds the maximum size of ${friendly}Bytes.`)
					next(err)
				} else {
					const err = createError(400, err.message)
					next(err)
				}
				return
			}

			let hash = null
			if (fields.hash) {
				const [algorithm, hash2] = fields.hash[0].split(':', 2)
				if (!useAlgorithm.includes(algorithm)) {
					const err = createError(422, 'This hash algorithm is unknown.')
					next(err)
					return
				}

				if (!isHash(hash2, algorithm)) {
					const err = createError(422, 'The hash is invalid format.')
					next(err)
					return
				}

				hash = {
					algorithm,
					hash: hash2,
				}
			}

			if (files['file']) {
				if (files['file'].length === 1) {
					const file = files['file'][0]
					if (hash) {
						const localHash = await getFileHash(hash.algorithm, file.path)
						if (hash.hash !== localHash) {
							const err = createError(422, 'The hash does not match.')
							next(err)
							return
						}
					}

					const body = await createUpload(file)
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
