const PropTypes = require('prop-types')
const React = require('react')

const AppearanceModal = require('./AppearanceModal')
const Footer = require('./Footer')
const NavBar = require('./NavBar')

/**
 * @param   {object}                            props
 * @param   {function(string): string}          props.t
 * @param   {string?}                           props.title
 * @param   {string}                            props.language
 * @param   {string|undefined}                  props.className
 * @param   {React.ReactNode[]|React.ReactNode} props.children
 * @param   {(string|object)[]|string}          props.stylesheets
 * @returns {React.JSX.Element}
 */
function Root({ t, title, language, className, stylesheets, children }) {
	if (typeof stylesheets === 'string') {
		stylesheets = [stylesheets]
	}

	return (
		<html lang={language}>
			<head>
				<title>{title ? title + ' - ' + t('sitename') : t('sitename')}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
				<link rel="stylesheet" href="/a/index.css" referrerPolicy="no-referrer" />
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
				<NavBar t={t} />

				{children}

				<Footer t={t} />
				<AppearanceModal t={t} />
				<script src="/a/bundle.js" />
			</body>
		</html>
	)
}
Root.propTypes = {
	t: PropTypes.func.isRequired,
	title: PropTypes.string,
	language: PropTypes.string.isRequired,
	className: PropTypes.string,
	stylesheets: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.shape({
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
	children: PropTypes.node.isRequired,
}
Root.defaultProps = {
	stylesheets: [],
}

module.exports = Root
