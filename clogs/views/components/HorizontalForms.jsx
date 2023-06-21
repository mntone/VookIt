const PropTypes = require('prop-types')
const React = require('react')

const { Hidden } = require('./Forms')

/**
 * @typedef TextInputProps
 * @property {string}  id
 * @property {string}  title
 * @property {string?} content
 * @property {string?} placeholder
 * @property {boolean} required
 * @property {boolean} disabled
 */

/**
 * input[type=text]
 * @param   {TextInputProps}    props
 * @returns {React.JSX.Element}
 */
function TextInput({ id, title, content, placeholder, required, disabled }) {
	return (
		<div className="field is-horizontal">
			<div className="field-label is-normal">
				<label className="label" htmlFor={id}>{title}</label>
			</div>
			<div className="field-body">
				<div className="field">
					<div className="control">
						<input className="input" id={id} name={id} defaultValue={content} placeholder={placeholder} required={required} disabled={disabled} />
					</div>
				</div>
			</div>
		</div>
	)
}
TextInput.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.string,
	placeholder: PropTypes.string,
	required: PropTypes.bool.isRequired,
	disabled: PropTypes.bool.isRequired,
}
TextInput.defaultProps = {
	required: false,
	disabled: false,
}

/**
 * @typedef TextAreaProps
 * @augments TextInputProps
 * @property {number?} cols
 * @property {number?} rows
 */

/**
 * textarea
 * @param   {TextAreaProps}     props
 * @returns {React.JSX.Element}
 */
function TextArea({ id, title, content, placeholder, required, disabled, cols, rows }) {
	return (
		<div className="field is-horizontal">
			<div className="field-label is-normal">
				<label className="label" htmlFor={id} style={{ height: '100%' }}>{title}</label>
			</div>
			<div className="field-body">
				<div className="field">
					<div className="control">
						<textarea className="textarea" id={id} name={id} cols={cols} rows={rows} placeholder={placeholder} required={required} disabled={disabled} defaultValue={content} />
					</div>
				</div>
			</div>
		</div>
	)
}
TextArea.propTypes = {
	cols: PropTypes.number,
	rows: PropTypes.number,
	...TextInput.propTypes,
}
TextArea.defaultProps = {
	...TextInput.defaultProps,
}

/**
 * Tag select
 * @param   {object}            props
 * @param   {string}            props.id
 * @param   {string}            props.title
 * @param   {string[]}          props.items
 * @param   {boolean}           props.disabled
 * @returns {React.JSX.Element}
 */
function Select({ id, title, items, disabled }) {
	return (
		<div className="field is-horizontal">
			<div className="field-label is-normal">
				<label className="label" htmlFor={id}>{title}</label>
			</div>
			<div className="field-body">
				<div className="field">
					<div className="control">
						<div className="select">
							<select id={id} name={id} disabled={disabled}>
								{items.map((item, index) => (
									<option key={index}>{item}</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
Select.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(PropTypes.string).isRequired,
	disabled: PropTypes.bool.isRequired,
}
Select.defaultProps = {
	disabled: false,
}

module.exports = {
	Hidden,
	TextInput,
	TextArea,
	Select,
}
