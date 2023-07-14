const PropTypes = require('prop-types')
const React = require('react')

const AppScript = require('../components/AppScript')
const StyleSheet = require('../components/StyleSheet')

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
	switch (typeof stylesheets) {
	case 'undefined':
		stylesheets = ['base', 'bulma']
		break
	case 'string':
		stylesheets = ['base', 'bulma', stylesheets]
		break
	default:
		if (Array.isArray(stylesheets)) {
			stylesheets = ['base', 'bulma', ...stylesheets]
		}
		break
	}
	if (typeof scripts === 'string') {
		scripts = [scripts]
	}

	return (
		<html lang={language}>
			<head>
				<title>{title ? title + ' - ' + t('sitename') : t('sitename')}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
				{stylesheets.map((stylesheet, i) => (
					<StyleSheet key={i} stylesheet={stylesheet} />
				))}
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
		StyleSheet.propTypes.stylesheet,
		PropTypes.arrayOf(StyleSheet.propTypes.stylesheet),
	]),
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
