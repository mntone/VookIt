const PropTypes = require('prop-types')
const React = require('react')

const Root = require('../components/Root')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {string}                   props.description
 * @returns {React.JSX.Element}
 */
function ErrorPage({ t, language, description }) {
	const title = t('errorpage.pagetitle')
	return (
		<Root
			t={t}
			title={title}
			language={language}>
			<div className="c">
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
		</Root>
	)
}
ErrorPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
}

module.exports = ErrorPage
