const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const Root = require('../components/Root')
const VideoCard = require('../components/VideoCard')

/**
 * @param   {object}                          props
 * @param   {function(string): string}        props.t
 * @param   {string}                          props.language
 * @param   {number}                          props.limit
 * @param   {import('@prisma/client').Post[]} props.posts
 * @returns {React.JSX.Element}
 */
function TopPage({ t, language, limit, posts }) {
	const isAdmin = false
	const count = posts.length

	let pager = null
	if (count === limit) {
		pager = (
			<div className="pp">
				{<a href={'/?until=' + posts[count - 1].postedBy.getTime()} className="button p-next is-light" style={{ width: '8rem' }}>Next</a>}
			</div>
		)
	}

	return (
		<Root
			t={t}
			language={language}
			className={count !== env.topMaxCount && `cc-max${Math.max(2, Math.ceil(count / 2))}`}>
			<div className="cc">
				{posts.slice(0, limit - 1).map((post, index) => (
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
	posts: PropTypes.array.isRequired,
}

module.exports = TopPage
