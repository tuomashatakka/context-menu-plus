'use babel'
import { getSettingsViewModule } from '../utils'
import { isVisible } from '../utils'

export default function SettingsGeneralPanel () {
  let GeneralPanel = getSettingsViewModule('general-panel')
  let panel = new GeneralPanel(arguments)

  // panel.focus = () =>
  //   panel.host.focus()
  //
  // panel.isVisible = () =>
  //   isVisible(panel.host.element)
  //
  // panel.toggle = () =>
  //   panel.isVisible() ? panel.hide() : panel.show()

  return panel
}
