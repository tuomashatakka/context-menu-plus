'use babel'

import FileExplorer, { FileIcons } from 'file-explorer'
import { CompositeDisposable, Disposable } from 'atom'
import { writeLessVariable } from './config'
import { resolve, dirname } from 'path'
import { join } from 'path'

const config = require('./config.json')

const pack = require('../package.json')

let subscriptions

let fileExplorer

const CONF_PATH = join(__dirname, '..', 'styles', 'conf.less')

function assertConf () {
  const { existsSync, writeFileSync } = require('fs')
  if (!existsSync(CONF_PATH))
    writeFileSync(CONF_PATH)
}


function resolvePath (path=null) {
  let item = atom.workspace.getActivePaneItem()
  let projectPaths = atom.project.getPaths()

  if (!path && item && item.getPath)
    path = item.getPath()

  else if (!path && projectPaths)
    path = projectPaths.length ? projectPaths[0] : '.'

  else
    path = '~'

  return resolve(dirname(path))
}

function openFile (uri) {
  return atom.workspace.openURIInPane(uri)
}

function openFileExplorer () {
  let path = resolvePath()
  return getFileExplorer().open(path)
}

function getFileExplorer () {
  if (!fileExplorer) {
    let path = resolvePath()
    fileExplorer = new FileExplorer({ path })
  }
  return fileExplorer
}


function observeIconSelectionFields () {
  let views = document.querySelectorAll('.item-views')
  let subscriptions = new CompositeDisposable()

  let setText = (element, path) => element.getModel ?
    element.getModel().setText(path) :
    element.value = path

  let callback = (e) => {
    let element = e.path.find(el => ['INPUT', 'LABEL', 'ATOM-TEXT-EDITOR'].indexOf(el.tagName) !== -1)
    // console.info("element", element)
    // console.log("path   ", ...e.path)
    // console.log("event  ", e)
    if (!element)
      return
    let id = element.getAttribute('id') || ''
    if (!id || !id.startsWith(`${pack.name}.icon`))
      return

    getFileExplorer()
      .requestFile()
      .then(path => {
        console.info(path)
        console.info(element)
        console.info(setText)
        setText(element, path)
      })
      .catch(e => alert(e.message || e))
  }

  views.forEach(view => {
    let bind   = () => view.addEventListener('mousedown', callback)
    let unbind = () => view.removeEventListener('mousedown', callback)
    subscriptions.add(new Disposable(unbind))
    bind()
  })
  return subscriptions
}


export default {

  config,

  initialize: () => {

    assertConf()
    subscriptions = new CompositeDisposable()
    subscriptions.add(
      atom.workspace.addOpener(url => url.startsWith('state:') ? document.createElement('div') : null))
  },

  activate: () => {

    let fn = conf => writeLessVariable(CONF_PATH, conf)
    let listener = observeIconSelectionFields()
    let configChange = atom.config.observe(pack.name, fn)
    subscriptions.add(configChange, listener)
  },

  deactivate: () => {
    subscriptions.dispose()
  },

  consumeFileIcons: (service) => {

    const update = () => getFileExplorer().reload()

    FileIcons.setService(service)
    update()

    return new Disposable(() => {
      FileIcons.resetService()
      update()
    })
  },

}
