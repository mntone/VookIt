const PropTypes = require('prop-types')
const React = require('react')

/**
 * @param   {object}            props
 * @param   {string}            props.path
 * @param   {string}            props.alt
 * @param   {number}            props.width
 * @param   {number}            props.height
 * @param   {object}            props.variantsByMimes
 * @returns {React.JSX.Element}
 */
function PictureSet({ alt, path, width, height, variantsByMimes }) {
	return (
		<picture>
			{Object.entries(variantsByMimes).map((p, i) => {
				const [mimeType, variants] = p
				const set = Object
					.entries(variants)
					.filter(([cond]) => cond !== 'default')
					.map(([cond, filename]) => path + filename + ' ' + cond)
					.join(',')
				return mimeType === 'default'
					? <img key={i} src={path + variants['default']} srcSet={set} alt={alt} width={width} height={height} />
					: <source key={i} type={mimeType} srcSet={set} />
			})}
		</picture>
	)
}
PictureSet.propTypes = {
	alt: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	variantsByMimes: PropTypes.shape({
		default: PropTypes.object.isRequired,
		['image/webp']: PropTypes.object,
		['image/avif']: PropTypes.object,
	}),
}

module.exports = PictureSet
