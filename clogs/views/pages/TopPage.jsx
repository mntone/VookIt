const PropTypes = require('prop-types')
const React = require('react')

const Root = require('../components/Root')
const VideoCard = require('../components/VideoCard')

/**
 * @param   {object}                          props
 * @param   {function(string): string}        props.t
 * @param   {string}                          props.language
 * @param   {number}                          props.limit
 * @param   {boolean}                         props.firstPage
 * @param   {import('@prisma/client').Post[]} props.posts
 * @returns {React.JSX.Element}
 */
function TopPage({ t, language, limit, firstPage, posts }) {
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
	limit: PropTypes.number.isRequired,
	firstPage: PropTypes.bool.isRequired,
	posts: PropTypes.array.isRequired,
}

module.exports = TopPage
