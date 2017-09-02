'use babel'

import { CompositeDisposable } from 'atom'
import Explorer from './models/Explorer'

let subscriptions


export function activate () {
  subscriptions = new CompositeDisposable()

  let modal
  let paths   = atom.project.getPaths()
  let browser = new Explorer(paths ? paths[0] : null)

  browser.onDidOpen(item => {
    // (modal = modal || atom.workspace.addModalPanel({ item })) && !modal.visible && modal.show()
    console.log('browser.ondidopen', item)

    modal = modal || atom.workspace.addModalPanel({ item })
    if (!modal.visible)
      modal.show()
  })

  browser.onDidSubmit((items) => console.log('browser.ondidclose', items))

  browser.onDidClose(() => {
    // modal && modal.hide()
    console.log('browser.ondidclose')

    if (modal)
      modal.hide()
  })

  subscriptions.add(
    atom.commands.add("atom-workspace", "application:open-file-browser", () => browser
      .requestFile()
      .then((items) => console.warn("Explorer.requestFile returned the following items:", items))
      .catch((err)  => console.warn("Explorer.requestFile threw an exception", err))
    ),
    atom.keymaps.add("atom-workspace", {
      'ctrl-alt-o': 'application:open-file-browser'
    })
  )

  window.B = browser
}

export function deactivate () {
  subscriptions.dispose()
}
