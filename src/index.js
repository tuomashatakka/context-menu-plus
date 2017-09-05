'use babel'
//@flow

import { CompositeDisposable } from 'atom'
import settngs from './config'
import * as model from './models'
import createMenuView from './views/ContextMenuView'
import createFragmentView from './views/FragmentView'
import SF from './models/StaticFragment'

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

  let menuFragment = new model.MenuFragment()
  let testFragment = new SF()
  subscriptions = new CompositeDisposable()
  menu = new model.ContextMenu()

  subscriptions.add(
    cmd('toggle'),
    cmd('enable'),
    cmd('disable'),
    settngs.observe(settngs.update),
    atom.config.observe(`${pack}.contextMenuEnabled`, onConfigChange),
    atom.views.addViewProvider(model.ContextMenu, model => createMenuView(model)),
    atom.views.addViewProvider(model.Fragment, model => createFragmentView(model)),
    atom.keymaps.add(ns, { 'ctrl-alt-*': command.toggle })
  )

  menu.fragments.add(menuFragment, testFragment)
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

export function provideContextMenu () {
  return ({
    Fragment:    model.Fragment,
    addFragment: (properties: FragmentProperties) => menu.fragments.add(new model.Fragment(properties))
  })
}
