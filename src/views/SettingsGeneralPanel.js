'use babel'
import { getSettingsViewModule } from '../utils'

export default function SettingsGeneralPanel () {
  let GeneralPanel = getSettingsViewModule('general-panel')
  return new GeneralPanel(arguments)
}
