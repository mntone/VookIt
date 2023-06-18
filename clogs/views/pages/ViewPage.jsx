const React = require('react')

const env = require('../../../constants/env')
const AppearanceModal = require('../components/AppearanceModal')
const DateTime = require('../components/DateTime')
const Footer = require('../components/Footer')
const NavBar = require('../components/NavBar')

// eslint-disable-next-line jsdoc/require-jsdoc
function getInlineScript(id) {
	return `
(function(){
	const dash = '/m/${id}/avc1/${env.mediaDashFilename}'
	const hls  = '/m/${id}/avc1/${env.mediaHlsFilename}'

	function initPlayer() {
		const videoElement = document.getElementById('video')
		videoElement.volume = 0.5
		const localPlayer = new shaka.Player(videoElement)
		const ui = new shaka.ui.Overlay(localPlayer, videoElement.parentElement,
		videoElement);
		localPlayer.load('MediaSource' in window ? dash : hls)
	}

	function initApp() {
		// Install built-in polyfills to patch browser incompatibilities.
		shaka.polyfill.installAll()

		if (shaka.Player.isBrowserSupported()) {
			initPlayer()
		}
	}

	initApp()
})()
`
}

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @param   {string}                   props.language
 * @param   {number}                   props.id
 * @param   {string}                   props.title
 * @param   {string}                   props.description
 * @param   {Date}                     props.postedBy
 * @param   {boolean}                  props.published
 * @param   {Date?}                    props.publishedBy
 * @returns {React.JSX.Element}
 */
// eslint-disable-next-line react/display-name, react/prop-types
module.exports = ({ t, language, id, title, description, postedBy, published, publishedBy }) => {
	return (
		<html lang={language}>
			<head>
				<title>{title + ' - ' + t('sitename')}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
				<link rel="stylesheet" href="/a/index.css" />
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.3.6/controls.min.css" integrity="sha512-FvnJOvchkjzz8TYMseY6gGQTdL3Ye3btvWMSoO8brPB9XLDPskq6LkyxwpgjSs1ZALn6lwq5V/5PNWmOd2HKdg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
				<script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.3.6/shaka-player.compiled.js" integrity="sha512-0EIXkpwZdEOMkzFncCxXMFlYC/RhHbf3Qxs3EXq3510l6ImA5yhD+Zq1OonrDV2r1ZKwqLpT7CRB2+o1VLclFA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
				<script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.3.6/shaka-player.ui.min.js" integrity="sha512-ze4f2Ces+TJRC2240tmQi8EhjZQ+/6h0TSYbnjUkQPii631D6Cl9rLumSyRWBMSTfacy6FNVxvqJOHx562t80A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
			</head>
			<body>
				<NavBar t={t} />

				<div className="VideoPlayer">
					<div id="player">
						<video id="video" playsInline data-shaka-player />
					</div>
					<script dangerouslySetInnerHTML={{ __html: getInlineScript(id) }} />
				</div>

				<div className="VideoInfo">
					<h1>{title}</h1>
					<span className="view-publishedBy">
						<DateTime datetime={published && publishedBy ? publishedBy : postedBy} />
					</span>
					<div>
						{description}
					</div>
				</div>

				<AppearanceModal t={t} />
				<Footer t={t} />
				<script src="/a/bundle.js" />
			</body>
		</html>
	)
}
