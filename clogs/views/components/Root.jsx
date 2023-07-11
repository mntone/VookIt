const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const AppScript = require('../components/AppScript')

const AppearanceModal = require('./AppearanceModal')
const Footer = require('./Footer')
const NavBar = require('./NavBar')

/**
 * @param   {object}                            props
 * @param   {function(string): string}          props.t
 * @param   {object}                            props.session
 * @param   {number?}                           props.session.uid
 * @param   {string?}                           props.redirect
 * @param   {string?}                           props.title
 * @param   {string}                            props.language
 * @param   {string|undefined}                  props.className
 * @param   {boolean}                           props.toppageLinkEnabled
 * @param   {React.ReactNode[]|React.ReactNode} props.children
 * @param   {(string|object)[]|string}          props.stylesheets
 * @param   {string[]|string}                   props.scripts
 * @param   {React.ReactNode[]|React.ReactNode} props.lastChild
 * @returns {React.JSX.Element}
 */
function Root({ t, session, redirect, title, language, className, toppageLinkEnabled, stylesheets, scripts, lastChild, children }) {
	if (typeof stylesheets === 'string') {
		stylesheets = [stylesheets]
	}
	if (typeof scripts === 'string') {
		scripts = [scripts]
	}

	return (
		<html lang={language}>
			<head>
				<title>{title ? title + ' - ' + t('sitename') : t('sitename')}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
				<link rel="stylesheet" href={`${env.styleRelativePath}/index.css`} referrerPolicy="no-referrer" />
				{stylesheets.map((stylesheet, i) => {
					switch (typeof stylesheet) {
					case 'string':
						return <link key={i} rel="stylesheet" href={stylesheet} referrerPolicy="no-referrer" />
					case 'object':
						return <link
							key={i}
							rel="stylesheet"
							href={stylesheet.href}
							integrity={stylesheet.integrity}
							crossOrigin={stylesheet.crossOrigin === 'anonymous' ? '' : stylesheet.crossOrigin}
							referrerPolicy={stylesheet.referrerPolicy || 'no-referrer'} />
					default:
						return null
					}
				})}
			</head>
			<body className={className}>
				<NavBar
					t={t}
					session={session}
					redirect={redirect}
					linkEnabled={toppageLinkEnabled} />

				<main id="m">
					{children}
				</main>

				<Footer t={t} />
				<AppearanceModal t={t} />
				<AppScript name="main" />
				{scripts.map((s, i) => <AppScript key={i} name={s} />)}
				{lastChild}
			</body>
		</html>
	)
}
Root.propTypes = {
	t: PropTypes.func.isRequired,
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
	redirect: PropTypes.string,
	title: PropTypes.string,
	language: PropTypes.string.isRequired,
	className: PropTypes.string,
	toppageLinkEnabled: PropTypes.bool,
	stylesheets: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.exact({
			href: PropTypes.string.isRequired,
			integrity: PropTypes.string,
			crossOrigin: PropTypes.oneOf(['anonymous', 'use-credentials']),
			referrerPolicy: PropTypes.oneOf([
				'no-referrer',
				'no-referrer-when-downgrade',
				'same-origin',
				'origin',
				'strict-origin',
				'origin-when-cross-origin',
				'strict-origin-when-cross-origin',
				'unsafe-url',
			]),
		})),
	]).isRequired,
	scripts: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
	]),
	lastChild: PropTypes.node,
	children: PropTypes.node.isRequired,
}
Root.defaultProps = {
	stylesheets: [],
	scripts: [],
}

module.exports = Root
