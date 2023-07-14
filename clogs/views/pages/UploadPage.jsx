const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const { addSIPrefix } = require('../../../utils/DataSizeSupport')
const AppScript = require('../components/AppScript')
const Root = require('../components/Root')

const getInlineScript = t => {
	const fileFriendly = addSIPrefix(env.uploadMaxFileSize, 1)
	const totalFriendly = addSIPrefix(env.uploadMaxTotalSize, 1)
	return `
'use strict'
window.hookUpload(Object.freeze({
	targetId: 'file',
	validationElementId: 'file-validation',
	dropFilename: ${env.uploadDeleteOriginalFilename},
	hashAlgorithm: 'sha256',
	maxConns: ${env.uploadMaxConnections},
	maxRetries: ${env.uploadMaxRetries},
	sizes: Object.freeze({
		chunk: ${env.uploadMaxChunkSize},
		file: ${env.uploadMaxFileSize},
		total: ${env.uploadMaxTotalSize},
	}),
	supportedMimeType: [${env.uploadSupportMimeTypes.map(mime => `'${mime}'`).join(',')}],
	messages: Object.freeze({
		mimeType: '${t('error.mediatype')}',
		fileSize: '${t('error.filesize').replace('{{filesize}}', fileFriendly)}',
		totalSize: '${t('error.filesize').replace('{{filesize}}', totalFriendly)}',
	}),
}))
`
}

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {object}                   props.session
 * @returns {React.JSX.Element}
 */
function UploadPage({ t, language, session }) {
	const title = t('uploadpage.pagetitle')
	const accept = env.uploadSupportExtensions.concat(env.uploadSupportMimeTypes).join(',')
	return (
		<Root
			t={t}
			title={title}
			language={language}
			session={session}>
			<div className="d">
				<h1>{title}</h1>

				<form action="/api/upload" encType="multipart/form-data" method="POST">
					<div className="control">
						<div className="file is-large is-boxed is-fullwidth">
							<label className="file-label">
								<input className="file-input" type="file" id="file" name="file" accept={accept} />
								<span className="file-cta">
									<span className="file-label">{t('uploadpage.choose')}</span>
								</span>
							</label>
						</div>
					</div>
					<p id="file-validation" className="help is-danger" />
					<p className="help"><ul>
						<li>{t('uploadpage.help')}</li>
						<li>{t('uploadpage.messages.limitsize')}</li>
						<li>{t('uploadpage.messages.limitfps')}</li>
					</ul></p>
					<noscript>
						<div className="control">
							<button className="b">{t('uploadpage.upload')}</button>
						</div>
					</noscript>
				</form>
				<AppScript name="upload" />
				<script dangerouslySetInnerHTML={{ __html: getInlineScript(t) }} defer={true} />
			</div>
		</Root>
	)
}
UploadPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
}

module.exports = UploadPage
