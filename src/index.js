'use babel'
import { CompositeDisposable } from 'atom'
import ContextMenu from './models/ContextMenuManager'
import createMenuElement from './views/ContextMenuView'

let menu
let subscriptions
let ns   = "atom-workspace"
let pack = "context-menu-plus"
let command  = {
  toggle:  'toggle-context-menu-plus',
  enable:  'enable-context-menu-plus',
  disable: 'use-native-context-menu',
}

function cmd (name) {
  return atom.commands.add(ns, ns + `${pack}:${command[name]}`, () => menu[name]())
}

export const config = require('../config.json')

export function activate () {
  menu = new ContextMenu()
  subscriptions = new CompositeDisposable()
  subscriptions.add(
    cmd('toggle'),
    cmd('enable'),
    cmd('disable'),
    atom.keymaps.add(ns, { 'ctrl-alt-*': command.toggle }),
    atom.views.addViewProvider(ContextMenu, model => createMenuElement(model)),
    atom.config.observe(`${pack}.contextMenuEnabled`, onConfigChange)
  )
  let view = atom.views.getView(menu)
  menu.enable()
  console.log(menu, view)
}

function onConfigChange (config) {
  console.info("ContextMenuPlus.onConfigChange", config)
  if (config.contextMenuEnabled)
    menu.enable()
  else
    menu.disable()
}

export function deactivate () {
  subscriptions.dispose()
  menu.disable()
}
