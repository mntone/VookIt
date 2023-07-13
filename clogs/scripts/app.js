import { AppearanceModal } from './components/AppearanceModal'
import { ModalSupport } from './utils/ModalSupport'

const scrollbarWidth = window.innerWidth - document.body.clientWidth
document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px')

new AppearanceModal()

// Hook all modals if available
ModalSupport.hook()
