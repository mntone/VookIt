const PropTypes = require('prop-types')
const React = require('react')
const validator = require('validator')

const Forms = require('../components/HorizontalForms')
const Root = require('../components/Root')

// Memo: I have a plan to add QR code, and upload video from smart phone quickly.

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {string}                   props.uuid
 * @returns
 */
function PostPage({ t, language, uuid }) {
	const pageTitle = t('postpage.pagetitle')
	return (
		<Root
			t={t}
			title={pageTitle}
			language={language}
			stylesheets="/a/form.css">
			<div className="c">
				<h1>{pageTitle}</h1>

				<form action="/api/post.html" method="POST">
					<Forms.Hidden id="uuid" content={uuid} />
					<Forms.TextInput id="title" title={t('postpage.title')} content={uuid} required={true} />
					<Forms.TextArea id="description" title={t('postpage.description')} content={'説明文です!\n' + uuid} />
					<Forms.Select id="visibility" title={t('postpage.visibility')} items={[
						{ value: 'private', content: t('postpage.visibility_private') },
						{ value: 'public', content: t('postpage.visibility_publicIfAvailable') },
					]} />

					<div className="field is-horizontal">
						<div className="field-label is-normal" />
						<div className="field-body">
							<div className="field is-grouped">
								<div className="control">
									<button className="button is-link" style={{ width: '7.5em' }}>{t('postpage.post')}</button>
								</div>
								<div className="control">
									<button className="button is-light" style={{ width: '7.5em' }}>{t('postpage.cancel')}</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</Root>
	)
}
PostPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	uuid: (props, propName, componentName) => {
		if (!validator.isUUID(props[propName])) {
			return new Error(`Invalid prop "${propName}" supplied to "${componentName}." Validation failed.`)
		}
	},
}

module.exports = PostPage
