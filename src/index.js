'use babel'

import { CompositeDisposable } from 'atom'
import Explorer from './models/Explorer'

let subscriptions


export function activate () {
  subscriptions = new CompositeDisposable()
  let paths = atom.project.getPaths()
  window.browser = new Explorer(paths ? paths[0] : null)
  console.log(window.browser)
  subscriptions.add(atom.commands.add("atom-workspace",
    "application:open-file-browser", () =>
    window.browser
      .requestFile()
      .then((items) => console.warn("Explorer.requestFile returned the following items:", items))
      .catch(()     => console.warn("Explorer.requestFile threw an exception"))
  ))
}

export function deactivate () {
  subscriptions.dispose()
}
