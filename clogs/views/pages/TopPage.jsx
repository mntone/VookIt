const PropTypes = require('prop-types')
const React = require('react')

const Root = require('../components/Root')
const VideoCard = require('../components/VideoCard')

/**
 * @param   {object}                          props
 * @param   {function(string): string}        props.t
 * @param   {string}                          props.language
 * @param   {object}                          props.session
 * @param   {number}                          props.limit
 * @param   {number | undefined}              props.until
 * @param   {boolean}                         props.firstPage
 * @param   {import('@prisma/client').Post[]} props.posts
 * @returns {React.JSX.Element}
 */
function TopPage({ t, language, session, limit, until, firstPage, posts }) {
	const isAdmin = false
	const count = posts.length

	let pager = null
	if (count === limit) {
		pager = (
			<div className="pp">
				<a
					className="b p-next"
					rel="next"
					href={'/?until=' + posts[count - 1].postedBy.getTime()}
					style={{ width: '7.5em' }}>
					{t('toppage.next')}
				</a>
			</div>
		)
		posts = posts.slice(0, limit - 1)
	}

	return (
		<Root
			t={t}
			language={language}
			session={session}
			redirect={until ? '%2F%3Funtil%3D' + until.toString() : undefined}
			className={`cc-max${Math.max(2, Math.ceil(count / 3))}`}
			toppageLinkEnabled={!firstPage}>
			<div className="cc">
				{posts.map((post, index) => (
					<VideoCard key={index} post={post} isAdmin={isAdmin} />
				))}
			</div>

			{pager}
		</Root>
	)
}
TopPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	session: PropTypes.shape({
		uid: PropTypes.number,
	}),
	limit: PropTypes.number.isRequired,
	until: PropTypes.number,
	firstPage: PropTypes.bool.isRequired,
	posts: PropTypes.array.isRequired,
}

module.exports = TopPage
