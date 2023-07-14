const PropTypes = require('prop-types')
const React = require('react')

const assetManifests = require('../../../.assets/assets-manifest.json')

/**
 * @typedef StylesheetInfo
 * @property {string}             href
 * @property {string | undefined} integrity
 * @property {string | undefined} crossOrigin
 * @property {string | undefined} referrerPolicy
 */

/**
 * @param   {object}            props
 * @param   {object}            props.stylesheet
 * @returns {React.JSX.Element}
 */
function StyleSheet({ stylesheet }) {
	/** @type {StylesheetInfo} */
	let info
	if (typeof stylesheet === 'string') {
		const assetManifest = assetManifests.assets[assetManifests.origins[stylesheet]].css[0]
		info = {
			href: `/a/${assetManifest.file}`,
			integrity: assetManifest.integrity,
			crossOrigin: 'anonymous',
		}
	} else {
		info = stylesheet
	}
	return (
		<link
			rel="stylesheet"
			href={info.href}
			integrity={info.integrity}
			crossOrigin={info.crossOrigin !== 'anonymous' ? info.crossOrigin : ''}
			referrerPolicy={info.referrerPolicy} />
	)
}
StyleSheet.propTypes = {
	stylesheet: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.exact({
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
		}),
	]).isRequired,
}

module.exports = StyleSheet
