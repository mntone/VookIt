const PropTypes = require('prop-types')
const React = require('react')

const AppearanceModal = require('../components/AppearanceModal')
const Footer = require('../components/Footer')
const NavBar = require('../components/NavBar')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {string}                   props.description
 * @returns {React.JSX.Element}
 */
function ErrorPage({ t, language, description }) {
	const title = t('errorpage.pagetitle')
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
						<h2 className="subtitle">{description}</h2>
					</div>
				</div>

				<AppearanceModal t={t} />
				<Footer t={t} />
				<script src="/a/bundle.js" />
			</body>
		</html>
	)
}
ErrorPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
}

module.exports = ErrorPage
