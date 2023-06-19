const PropTypes = require('prop-types')
const React = require('react')

const env = require('../../../constants/env')
const { numToUsid } = require('../../../utils/IdSupport')

const DateTime = require('./DateTime')
const PictureSet = require('./PictureSet')

/**
 * @param   {object}                        props
 * @param   {import('@prisma/client').Post} props.post
 * @param   {boolean}                       props.isAdmin
 * @returns {React.JSX.Element}
 */
function VideoCard({ post, isAdmin }) {
	const usid = numToUsid(post.id)
	return (
		<div className="VideoCard">
			<a className="VideoCard-link" href={'/v/' + usid}>
				<figure>
					<PictureSet
						path={`/m/${usid}/`}
						alt={post.title}
						width={env.videoCardThumbnailWidth}
						height={env.videoCardThumbnailHeight}
						variantsByMimes={env.videoCardThumbnailVariantsByMimes} />
				</figure>
				<h2>{post.title}</h2>
				<p className="VideoCard-time">
					<DateTime datetime={post.postedBy} />
				</p>
			</a>
			{isAdmin ? (
				<footer className="card-footer">
					<a href="#" className="card-footer-item p-2">Edit</a>
					<a href="#" className="card-footer-item p-2 has-text-danger-dark">Delete</a>
				</footer>
			) : ''}
		</div>
	)
}
VideoCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		postedBy: PropTypes.objectOf(Date).isRequired,
	}).isRequired,
	isAdmin: PropTypes.bool.isRequired,
}

module.exports = VideoCard
