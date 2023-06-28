const PropTypes = require('prop-types')
const React = require('react')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {boolean}                  props.linkEnabled
 * @returns {React.JSX.Element}
 */
function NavBar({ t, linkEnabled }) {
	return (
		<nav className="nn" role="navigation" aria-label="main navigation">
			<a className="n-brand n-item" href={linkEnabled !== false ? '/' : undefined}>{t('sitename')}</a>

			<div className="n-item buttons">
				<a className="button is-primary" rel="nofollow" href="/upload">
					<strong>{t('navbar.upload')}</strong>
				</a>
				<button className="button is-light hint-popoverable" data-target="AppearanceModal" disabled={true}>
					<strong>{t('navbar.settings')}</strong>
				</button>
			</div>
		</nav>
	)
}
NavBar.propTypes = {
	t: PropTypes.func.isRequired,
	linkEnabled: PropTypes.bool,
}

module.exports = NavBar
