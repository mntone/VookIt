const PropTypes = require('prop-types')
const React = require('react')

const { Hidden } = require('./Forms')

/**
 * @typedef TextInputProps
 * @property {'text' | 'password'}               type
 * @property {string}                            id
 * @property {string}                            title
 * @property {string?}                           content
 * @property {string?}                           placeholder
 * @property {number}                            minimumLength
 * @property {number}                            maximumLength
 * @property {boolean}                           required
 * @property {boolean}                           disabled
 * @property {React.ReactNode[]|React.ReactNode} children
 */

/**
 * input[type=text]
 * @param   {TextInputProps}    props
 * @returns {React.JSX.Element}
 */
function TextInput({ type, id, title, content, placeholder, minimumLength, maximumLength, required, disabled, children }) {
	return (
		<div className="field is-horizontal">
			<div className="field-label is-normal">
				<label className="label" htmlFor={id}>{title}</label>
			</div>
			<div className="field-body">
				<div className="field">
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
			</div>
		</div>
	)
}
TextInput.propTypes = {
	type: PropTypes.string,
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
	type: 'text',
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
function TextArea({ id, title, content, placeholder, minimumLength, maximumLength, required, disabled, cols, rows, children }) {
	return (
		<div className="field is-horizontal">
			<div className="field-label is-normal">
				<label className="label" htmlFor={id} style={{ height: '100%' }}>{title}</label>
			</div>
			<div className="field-body">
				<div className="field">
					<div className="control">
						<textarea
							className="textarea"
							id={id}
							name={id}
							cols={cols}
							rows={rows}
							defaultValue={content}
							placeholder={placeholder}
							minLength={minimumLength}
							maxLength={maximumLength}
							required={required}
							disabled={disabled} />
					</div>
					{children}
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
 * @param   {object}                               props
 * @param   {string}                               props.id
 * @param   {string}                               props.title
 * @param   {{ value: string, content: string }[]} props.items
 * @param   {string?}                              props.defaultValue
 * @param   {boolean}                              props.disabled
 * @returns {React.JSX.Element}
 */
function Select({ id, title, items, defaultValue, disabled }) {
	return (
		<div className="field is-horizontal">
			<div className="field-label is-normal">
				<label className="label" htmlFor={id}>{title}</label>
			</div>
			<div className="field-body">
				<div className="field">
					<div className="control">
						<div className="select">
							<select id={id} name={id} defaultValue={defaultValue} disabled={disabled}>
								{items.map(({ value, content }, index) => (
									<option key={index} value={value}>{content}</option>
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
	items: PropTypes.arrayOf(PropTypes.exact({
		value: PropTypes.string,
		content: PropTypes.string.isRequired,
	})).isRequired,
	defaultValue: PropTypes.string,
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
