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
			language={language}
			stylesheets="/a/form.css">
			<div className="container is-max-desktop">
				<div className="box is-unselectable">
					<h1 className="title">{title}</h1>
					<h2 className="subtitle">{description}</h2>
				</div>
			</div>
		</Root>
	)
}
ErrorPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
}

module.exports = ErrorPage
