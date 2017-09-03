'use babel'
//@flow

import { CompositeDisposable } from 'atom'
import * as model from './models'
import createMenuView from './views/ContextMenuView'
import createFragmentView from './views/FragmentView'
import MenuFragment from './models/MenuFragment'

let menu

let subscriptions

let ns   = "atom-workspace"

let pack = "context-menu-plus"

let command  = {
  toggle:  'toggle',
  enable:  'enable',
  disable: 'use-native-menu',
}

const cmd = (name) => atom.commands.add(ns, `${pack}:${command[name]}`, () => menu[name]())

export const config = require('../config.json')

export function activate () {

  subscriptions = new CompositeDisposable()
  let menuFragment = new MenuFragment()
  menu = new model.ContextMenu(menuFragment)

  subscriptions.add(
    cmd('toggle'),
    cmd('enable'),
    cmd('disable'),
    atom.keymaps.add(ns, { 'ctrl-alt-*': command.toggle }),
    atom.views.addViewProvider(model.ContextMenu, model => createMenuView(model)),
    atom.views.addViewProvider(model.Fragment, model => createFragmentView(model)),
    atom.config.observe(`${pack}.contextMenuEnabled`, onConfigChange)
  )
  menu.enable()
}

function onConfigChange (config) {
  if (config.contextMenuEnabled)
    menu.enable()
  else
    menu.disable()
}

export function deactivate () {
  subscriptions.dispose()
  menu.disable()
}
