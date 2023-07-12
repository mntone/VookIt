const PropTypes = require('prop-types')
const React = require('react')

const manifest = require('../../../.assets/assets-manifest.json')

/**
 * @param   {object}            props
 * @param   {string}            props.name
 * @returns {React.JSX.Element}
 */
function AppScript({ name }) {
	return (
		<script
			src={`/a/${name}.js`}
			integrity={manifest.assets[manifest.origins[name]].js[0].integrity}
			crossOrigin="anonymous" />
	)
}
AppScript.propTypes = {
	name: PropTypes.string.isRequired,
}

module.exports = AppScript
