const PropTypes = require('prop-types')
const React = require('react')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @returns {React.JSX.Element}
 */
function NavBar({ t }) {
	return (
		<div className="nnc">
			<nav className="nn" role="navigation" aria-label="main navigation">
				<div className="n-brand">
					<a className="n-item n-title" href="/">{t('sitename')}</a>
				</div>

				<div className="n-end">
					<div className="n-item buttons">
						<a className="button is-primary" href="/upload">
							<strong>{t('navbar.upload')}</strong>
						</a>
						<button className="button is-light hint-popoverable" data-target="AppearanceModal" disabled={true}>
							<strong>{t('navbar.settings')}</strong>
						</button>
					</div>
				</div>
			</nav>
		</div>
	)
}
NavBar.propTypes = {
	t: PropTypes.func.isRequired,
}

module.exports = NavBar
