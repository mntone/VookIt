const PropTypes = require('prop-types')
const React = require('react')

// eslint-disable-next-line node/no-missing-require
const { getSoftwareVersion, getGitHash } = require('../../utils/version.mjs')

const hash = getGitHash().slice(0, 7)
const version = getSoftwareVersion()

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @returns {React.JSX.Element}
 */
function Footer({ t }) {
	const sitename = t('sitename')

	let content
	if (sitename === 'VookIt!') {
		content = (
			<span className="Footer-title">
				<strong>{t('sitename')}</strong> Ver. {version} (<code>{hash}</code>)
			</span>
		)
	} else {
		content = (
			<span className="Footer-title">
				<strong>{t('sitename')}</strong> powered by <i> VookIt!</i> Ver. {version} (<code>{hash}</code>)
			</span>
		)
	}

	return (
		<footer className="Footer">
			{content}
		</footer>
	)
}
Footer.propTypes = {
	t: PropTypes.func.isRequired,
}

module.exports = Footer
