const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const { addSIPrefix } = require('../../../utils/DataSizeSupport')
const AppScript = require('../components/AppScript')
const Root = require('../components/Root')

const getInlineScript = t => {
	const friendly = addSIPrefix(env.uploadMaxFileSize, 1)
	return `
'use strict'
const info = {
	targetId: 'file',
	useHashAlgorithm: 'sha256',
	maxFilesize: ${env.uploadMaxFileSize},
	supportedMimeType: [${env.uploadSupportMimeTypes.map(mime => `'${mime}'`).join(',')}],
	messages: {
		mimeType: '${t('error.mediatype')}',
		fileSize: '${t('error.filesize').replace('{{filesize}}', friendly)}',
	},
}
window.installUpload(info)
`
}

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @returns {React.JSX.Element}
 */
function UploadPage({ t, language }) {
	const title = t('uploadpage.pagetitle')
	const accept = env.uploadSupportExtensions.concat(env.uploadSupportMimeTypes).join(',')
	return (
		<Root
			t={t}
			title={title}
			language={language}
			stylesheets={`${env.styleRelativePath}/form.css`}>
			<div className="c">
				<h1>{title}</h1>

				<form action="/api/upload.html" encType="multipart/form-data" method="POST">
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
					<p className="help"><ul>
						<li>{t('uploadpage.help')}</li>
						<li>21.6:9までの動画は高さ基準で処理されます</li>
					</ul></p>
					<noscript>
						<div className="control">
							<button className="button is-primary">{t('uploadpage.upload')}</button>
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
}

module.exports = UploadPage
