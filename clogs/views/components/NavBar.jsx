const PropTypes = require('prop-types')
const React = require('react')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {object}                   props.session
 * @param   {number?}                  props.session.uid
 * @param   {string?}                  props.redirect
 * @param   {boolean}                  props.linkEnabled
 * @returns {React.JSX.Element}
 */
function NavBar({ t, session, redirect, linkEnabled }) {
	return (
		<nav id="n" className="nn" role="navigation" aria-label="main navigation">
			<a className="n-brand n-item" href={linkEnabled !== false ? '/' : undefined}>{t('sitename')}</a>

			<div className="n-item bb">
				{session?.uid
					? (
						<>
				<a className="b b-accent" rel="nofollow" href="/upload">
					<strong>{t('navbar.upload')}</strong>
				</a>
							<a
								className="b"
								rel="nofollow"
								href={redirect ? '/auth/logout?r=' + redirect : '/auth/logout'}>
								{t('navbar.logout')}
							</a>
						</>
					)
					: (
						<a
							className="b"
							rel="nofollow"
							href={redirect ? '/login?r=' + redirect : '/login'}>
							{t('navbar.login')}
						</a>
					)
				}
				<button className="b hint-popoverable" data-target="AppearanceModal" disabled={true}>
					{t('navbar.settings')}
				</button>
			</div>
		</nav>
	)
}
NavBar.propTypes = {
	t: PropTypes.func.isRequired,
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
	redirect: PropTypes.string,
	linkEnabled: PropTypes.bool,
}

module.exports = NavBar
