const PropTypes = require('prop-types')
const React = require('react')

const Root = require('../components/Root')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {object}                   props.session
 * @param   {string}                   props.description
 * @returns {React.JSX.Element}
 */
function ErrorPage({ t, language, session, description }) {
	const title = t('errorpage.pagetitle')
	return (
		<Root
			t={t}
			title={title}
			language={language}
			session={session}>
			<div className="d">
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
		</Root>
	)
}
ErrorPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
	description: PropTypes.string.isRequired,
}

module.exports = ErrorPage
