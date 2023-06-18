const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const AppearanceModal = require('../components/AppearanceModal')
const Footer = require('../components/Footer')
const NavBar = require('../components/NavBar')
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
	return (
		<html lang={language}>
			<head>
				<title>{t('sitename')}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
				<link rel="stylesheet" href="/a/index.css" />
			</head>
			<body className={count !== env.topMaxCount && `cc-max${Math.max(2, Math.ceil(count / 2))}`}>
				<NavBar t={t} />

				<div className="cc">
					{posts.slice(0, limit - 1).map((post, index) => (
						<VideoCard key={index} post={post} isAdmin={isAdmin} />
					))}
				</div>

				<div className="pp">
					{count === limit && <a href={'/?until=' + posts[count - 1].postedBy.getTime()} className="button p-next is-light" style={{ width: '8rem' }}>Next</a>}
				</div>

				<AppearanceModal t={t} />
				<Footer t={t} />
				<script src="/a/bundle.js" />
			</body>
		</html>
	)
}
TopPage.propTypes = {
	t: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	limit: PropTypes.number.isRequired,
	posts: PropTypes.array.isRequired,
}

module.exports = TopPage
