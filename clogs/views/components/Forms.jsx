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

/**
 * input[type=text]
 * @param   {TextInputProps}    props
 * @returns {React.JSX.Element}
 */
function TextInput({ type, id, title, content, placeholder, minimumLength, maximumLength, required, disabled, children }) {
	return (
		<div className="field">
			<label className="label" htmlFor={id}>{title}</label>
			<div className="control">
				<input
					className="input"
					type={type !== 'text' ? type : undefined}
					id={id}
					name={id}
					defaultValue={content}
					placeholder={placeholder}
					minLength={minimumLength}
					maxLength={maximumLength}
					required={required}
					disabled={disabled} />
			</div>
			{children}
		</div>
	)
}
TextInput.propTypes = {
	type: 'text',
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.string,
	placeholder: PropTypes.string,
	minimumLength: PropTypes.number,
	maximumLength: PropTypes.number,
	required: PropTypes.bool.isRequired,
	disabled: PropTypes.bool.isRequired,
	children: PropTypes.node,
}
TextInput.defaultProps = {
	required: false,
	disabled: false,
}

module.exports = {
	Hidden,
	TextInput,
}
