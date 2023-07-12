const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const Forms = require('../components/Forms')
const Root = require('../components/Root')

const getInlineScript = t => {
	const screennameValidation = t('signinpage.validation.screenname')
		.replace('{{minimum}}', env.screennameMinimumLength)
		.replace('{{maximum}}', env.screennameMaximumLength)
	const passwordValidation = t('signinpage.validation.password')
		.replace('{{minimum}}', env.passwordMinimumLength)
		.replace('{{maximum}}', env.passwordMaximumLength)
	return `
'use strict'
new window.SignInForm(Object.freeze({
	screenname: ['screenname', {
		invalidClassName: 'is-danger',
		messageElementId: 'screenname-validation',
		validationMessage: '${screennameValidation}',
	}],
	password: ['password', {
		invalidClassName: 'is-danger',
		messageElementId: 'password-validation',
		validationMessage: '${passwordValidation}',
	}],
	signin: 'signin',
}))
`
}

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {object}                   props.session
 * @param   {string | undefined}       props.redirect
 * @returns
 */
function SignInPage({ t, language, session, redirect }) {
	const pageTitle = t('signinpage.pagetitle')
	return (
		<Root
			t={t}
			title={pageTitle}
			language={language}
			session={session}
			stylesheets={'/a/form.css'}
			scripts="signin"
			lastChild={<script dangerouslySetInnerHTML={{ __html: getInlineScript(t) }} defer={true} />}>
			<div className="d d-narrow">
				<h1>{pageTitle}</h1>

				<form action="/auth/login" method="POST">
					<Forms.Hidden id="redirect" content={redirect} />

					<Forms.TextInput
						id="screenname"
						title={t('signinpage.screenname')}
						minimumLength={env.screennameMinimumLength}
						maximumLength={env.screennameMaximumLength}
						required={true}>
						<p id="screenname-validation" className="help is-danger" />
					</Forms.TextInput>

					<Forms.TextInput
						type="password"
						id="password"
						title={t('signinpage.password')}
						minimumLength={env.passwordMinimumLength}
						maximumLength={env.passwordMaximumLength}
						required={true}>
						<p id="password-validation" className="help is-danger" />
					</Forms.TextInput>

					<div className="field">
						<div className="control">
							<button id="signin" className="b" style={{ width: '100%' }}><strong>{t('signinpage.signin')}</strong></button>
						</div>
					</div>
				</form>
			</div>
		</Root>
	)
}
SignInPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
	redirect: PropTypes.string,
}

module.exports = SignInPage
