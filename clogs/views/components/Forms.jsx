const PropTypes = require('prop-types')
const React = require('react')

/**
 * input[type=hidden]
 * @param   {object}            props
 * @param   {string}            props.id
 * @param   {string?}           props.content
 * @returns {React.JSX.Element}
 */
function Hidden({ id, content }) {
	return (
		<input type="hidden" name={id} value={content} />
	)
}
Hidden.propTypes = {
	id: PropTypes.string.isRequired,
	content: PropTypes.string,
}

module.exports = {
	Hidden,
}
