const PropTypes = require('prop-types')
const React = require('react')

/**
 * @param   {object}                   props
 * @param   {function(string): string} props.t
 * @returns {React.JSX.Element}
 */
function AppearanceModal({ t }) {
	return (
		<div id="AppearanceModal" className="AppearanceModal modal">
			<div className="modal-background" />

			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">{t('navbar.modal.appearance')}</p>
					<button className="delete is-large" title={t('navbar.modal.close')} aria-label={t('navbar.modal.close')} />
				</header>

				<section className="modal-card-body">
					<div className="field">
						<label className="label" htmlFor="theme">{t('navbar.modal.theme')}</label>
						<div className="control">
							<div className="select">
								<select id="theme">
									<option>{t('navbar.modal.theme_default')}</option>
									<option>{t('navbar.modal.theme_light')}</option>
									<option>{t('navbar.modal.theme_dark')}</option>
								</select>
							</div>
						</div>
					</div>

					<div className="field">
						<input type="checkbox" className="switch is-rounded" id="AppearanceModal-animation" />
						<label htmlFor="AppearanceModal-animation">{t('navbar.modal.animation')}</label>
					</div>

					<div className="field">
						<input type="checkbox" className="switch is-rounded" id="AppearanceModal-noscale" />
						<label htmlFor="AppearanceModal-noscale">{t('navbar.modal.noscale')}</label>
					</div>
				</section>

				<footer className="modal-card-foot">
					<button className="b b-accent" id="AppearanceModal-save">{t('navbar.modal.save')}</button>
				</footer>
			</div>
		</div>
	)
}
AppearanceModal.propTypes = {
	t: PropTypes.func.isRequired,
}

module.exports = AppearanceModal
