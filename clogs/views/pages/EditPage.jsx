const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const { numToUsid } = require('../../../utils/IdSupport')
const Forms = require('../components/HorizontalForms')
const Root = require('../components/Root')

/**
 * @param   {object}                        props
 * @param   {function(string): string}      props.t
 * @param   {string}                        props.language
 * @param   {import('@prisma/client').Post} props.post
 * @returns
 */
function EditPage({ t, language, post }) {
	const pageTitle = t('editpage.pagetitle')
	const usid = numToUsid(post.id)
	return (
		<Root
			t={t}
			title={pageTitle}
			language={language}
			stylesheets={`${env.styleRelativePath}/form.css`}>
			<div className="c">
				<h1>{pageTitle}</h1>

				<form action={`/api/post/${usid}.html`} method="POST">
					<Forms.TextInput id="title" title={t('postpage.title')} content={post.title} required={true} />
					<Forms.TextArea id="description" title={t('postpage.description')} content={post.description} />
					<Forms.Select id="visibility" title={t('postpage.visibility')} items={[
						{ value: 'private', content: t('postpage.visibility_private') },
						{ value: 'public', content: t('postpage.visibility_publicIfAvailable') },
					]} />

					<div className="field is-horizontal">
						<div className="field-label is-normal" />
						<div className="field-body">
							<div className="field is-grouped">
								<div className="control">
									<button className="button is-link" style={{ width: '7.5em' }}>{t('editpage.update')}</button>
								</div>
								<div className="control">
									<a className="button is-light" style={{ width: '7.5em' }} rel="nofollow" href={`/v/${usid}`}>{t('editpage.cancel')}</a>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</Root>
	)
}
EditPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}),
}

module.exports = EditPage
