const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const { numToUsid } = require('../../utils/IdSupport')
const Forms = require('../components/HorizontalForms')
const Root = require('../components/Root')

const getInlineScript = t => {
	const titleValidation = t('editpage.validation.title')
		.replace('{{minimum}}', env.titleLength.min)
		.replace('{{maximum}}', env.titleLength.max)
	const descriptionValidation = t('editpage.validation.description')
		.replace('{{maximum}}', env.descriptionMaximumLength)
	return `
'use strict'
new window.EditForm(Object.freeze({
	title: ['title', {
		invalidClassName: 'is-danger',
		messageElementId: 'title-validation',
		validationMessage: '${titleValidation}',
	}],
	description: ['description', {
		invalidClassName: 'is-danger',
		messageElementId: 'description-validation',
		validationMessage: '${descriptionValidation}',
	}],
	visibility: 'visibility',
	update: 'update',
	cancel: 'cancel',
}))
`
}

/**
 * @param   {object}                        props
 * @param   {function(string): string}      props.t
 * @param   {string}                        props.language
 * @param   {object}                        props.session
 * @param   {import('@prisma/client').Post} props.post
 * @returns
 */
function EditPage({ t, language, session, post }) {
	const pageTitle = t('editpage.pagetitle')
	const usid = numToUsid(post.id)
	return (
		<Root
			t={t}
			title={pageTitle}
			language={language}
			session={session}
			redirect={'%2Fe%2F' + usid}
			stylesheets={`${env.styleRelativePath}/form.css`}
			scripts="edit"
			lastChild={<script dangerouslySetInnerHTML={{ __html: getInlineScript(t) }} defer={true} />}>
			<div className="d">
				<h1>{pageTitle}</h1>

				<form action={`/api/post/${usid}.html`} method="POST">
					<Forms.TextInput
						id="title"
						title={t('editpage.title')}
						content={post.title}
						minimumLength={env.titleLength.min}
						maximumLength={env.titleLength.max}
						required={true}>
						<p id="title-validation" className="help is-danger" />
					</Forms.TextInput>

					<Forms.TextArea
						id="description"
						title={t('editpage.description')}
						content={post.description}
						maximumLength={env.descriptionMaximumLength}>
						<p id="description-validation" className="help is-danger" />
					</Forms.TextArea>

					<Forms.Select id="visibility" title={t('editpage.visibility')} items={[
						{ value: 'private', content: t('editpage.visibility_private') },
						{ value: 'public', content: t('editpage.visibility_publicIfAvailable') },
					]} defaultValue={post.published ? 'public' : 'private'} />

					<div className="field is-horizontal">
						<div className="field-label is-normal" />
						<div className="field-body">
							<div className="field is-grouped">
								<div className="control">
									<button id="update" className="b" style={{ width: '7.5em' }}><strong>{t('editpage.update')}</strong></button>
								</div>
								<div className="control">
									<a id="cancel" className="b" style={{ width: '7.5em' }} rel="nofollow" href={`/v/${usid}`}>{t('editpage.cancel')}</a>
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
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		published: PropTypes.bool.isRequired,
	}),
}

module.exports = EditPage
