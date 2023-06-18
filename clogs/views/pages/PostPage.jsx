const PropTypes = require('prop-types')
const React = require('react')
const validator = require('validator')

const AppearanceModal = require('../components/AppearanceModal')
const Footer = require('../components/Footer')
const Forms = require('../components/HorizontalForms')
const NavBar = require('../components/NavBar')

// Memo: I have a plan to add QR code, and upload video from smart phone quickly.

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param                              props.uuid
 * @returns
 */
function PostPage({ t, language, uuid }) {
	const title = t('postpage.pagetitle')
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

						<form action="/api/post.html" method="POST">
							<Forms.Hidden id="uuid" content={uuid} />
							<Forms.TextInput id="title" title={t('postpage.title')} content={uuid} required={true} />
							<Forms.TextArea id="description" title={t('postpage.description')} content={'説明文です!\n' + uuid} />
							<Forms.Select id="visibility" title={t('postpage.visibility')} items={[
								t('postpage.visibility_private'),
								t('postpage.visibility_publicIfAvailable'),
							]} />

							<div className="field is-horizontal">
								<div className="field-label is-normal" />
								<div className="field-body">
									<div className="field is-grouped">
										<div className="control">
											<button className="button is-link" style={{ width: '7.5em' }}>{t('postpage.post')}</button>
										</div>
										<div className="control">
											<button className="button is-light" style={{ width: '7.5em' }}>{t('postpage.cancel')}</button>
										</div>
									</div>
								</div>
							</div>
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
PostPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	uuid: (props, propName, componentName) => {
		if (!validator.isUUID(props[propName])) {
			return new Error(`Invalid prop "${propName}" supplied to "${componentName}." Validation failed.`)
		}
	},
}

module.exports = PostPage
