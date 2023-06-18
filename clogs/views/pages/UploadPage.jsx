const PropTypes = require('prop-types')
const React = require('react')

const AppearanceModal = require('../components/AppearanceModal')
const Footer = require('../components/Footer')
const NavBar = require('../components/NavBar')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @returns {React.JSX.Element}
 */
function UploadPage({ t, language }) {
	const title = t('uploadpage.pagetitle')
	return (
		<html lang={language}>
			<head>
				<title>{title + ' - ' + t('sitename')}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
				<link rel="stylesheet" href="/a/index.css" />
				<link rel="stylesheet" href="/a/form.css" />
			</head>
			<body>
				<NavBar t={t} />

				<div className="container is-max-desktop">
					<div className="box is-unselectable">
						<h1 className="title">{title}</h1>

						<form action="/api/upload.html" encType="multipart/form-data" method="POST">
							<div className="control">
								<div className="file is-large is-boxed is-fullwidth">
									<label className="file-label">
										<div dangerouslySetInnerHTML={{ __html: '<input class="file-input" type="file" name="file" accept=".mp4,.webm,video/mp4,video/webm" onchange="submit(this.form)" />' }} />
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
						</form>
					</div>
				</div>

				<AppearanceModal t={t} />
				<Footer t={t} />
				<script src="/a/bundle.js" />
			</body>
		</html>
	)
}
UploadPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
}

module.exports = UploadPage
