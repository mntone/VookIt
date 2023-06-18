const PropTypes = require('prop-types')
const React = require('react')

/**
 * @param   {object}            props
 * @param   {Date}              props.datetime
 * @returns {React.JSX.Element}
 */
function DateTime({ datetime }) {
	return (
		<time dateTime={datetime.toISOString()}>
			{datetime.toLocaleString('ja-JP')}
		</time>
	)
}
DateTime.propTypes = {
	datetime: PropTypes.instanceOf(Date).isRequired,
}

module.exports = DateTime
