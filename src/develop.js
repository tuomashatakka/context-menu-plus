'use babel'

import { watch } from 'fs'
import { dirname } from 'path'
import { Disposable } from 'atom'

async function deactivate (name) {
  await atom.packages.deactivatePackage(name)
  atom.packages.unloadPackage(name)
  return true
}

async function activate (name) {
  atom.packages.loadPackage(name)
  return await atom.packages.activatePackage(name)
}

export default function observePackageChanges (name) {

  if (window.devWatcher)
    window.devWatcher.close()

  let pack    = atom.packages.getLoadedPackage(name)
  let watcher = watch(

    dirname(pack.mainModulePath),
    async function (event, filename) {

      console.warn('fswatcher.' + event, 'on', filename, watcher)
      console.log('pack', pack)

      await deactivate(name)

      setTimeout(async function () {

        let p = await activate(name)
        let modu = require(p.mainModulePath)

        console.log({ p, pack, modu })

        pack.mainModule = modu
        pack.mainActivated = false
        pack.mainInitialized = false
        pack.mainModuleRequired = false

        modu.activate()

        pack.load()
        pack.activate()
      }, 600)

    })

  window.devWatcher = watcher
  return new Disposable(() => watcher.close())
}
