const PropTypes = require('prop-types')
const React = require('react')

const manifest = require('../../../.assets/assets-manifest.json')
const env = require('../../../constants/env')

/**
 * @param   {object}            props
 * @param   {string}            props.name
 * @returns {React.JSX.Element}
 */
function AppScript({ name }) {
	return (
		<script
			src={`${env.scriptRelativePath}/${name}.js`}
			integrity={manifest.assets[name].js[0].integrity}
			crossOrigin="anonymous" />
	)
}
AppScript.propTypes = {
	name: PropTypes.string.isRequired,
}

module.exports = AppScript
