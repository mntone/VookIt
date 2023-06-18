const PropTypes = require('prop-types')
const React = require('react')

const { getSoftwareVersion, getGitHashSync } = require('../../utils/VersionSupport')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @returns {React.JSX.Element}
 */
function Footer({ t }) {
	const hash = getGitHashSync().slice(0, 7)
	const version = getSoftwareVersion()
	return (
		<footer className="Footer">
			<span className="Footer-title subtitle is-6">
				<strong>{t('sitename')}</strong> powered by <i>VookIt!</i> Ver. {version} (<code>{hash}</code>)
			</span>
		</footer>
	)
}
Footer.propTypes = {
	t: PropTypes.func.isRequired,
}

module.exports = Footer
