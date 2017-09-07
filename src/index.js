'use babel'
//@flow

import { CompositeDisposable, Disposable } from 'atom'
import settngs from './config'
import * as model from './models'
import createMenuView from './views/ContextMenuView'
import createFragmentView from './views/FragmentView'
import SF from './models/StaticFragment'

export let menu

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
  subscriptions    = new CompositeDisposable()
  menu             = new model.ContextMenu()

  subscriptions.add(
    cmd('toggle'),
    cmd('enable'),
    cmd('disable'),
    // atom.commands.add(ns, `${pack}:tree-view-decorz`, decorateTreeView),
    settngs.observe(settngs.update),
    atom.config.observe(`${pack}.contextMenuEnabled`, onConfigChange),
    atom.views.addViewProvider(model.ContextMenu, model => createMenuView(model)),
    atom.views.addViewProvider(model.Fragment, model => createFragmentView(model)),
    atom.keymaps.add(ns, { 'ctrl-alt-*': command.toggle })
  )

  menu.fragments.add(
    menuFragment,
    testFragment)

  menu.enable()
}

function onConfigChange (config) {
  if (config && config.contextMenuEnabled)
    menu.enable()
  else
    menu.disable()
}

export function deactivate () {
  subscriptions.dispose()
  menu.disable()
}

type fragment = {
  asd: number
};

export function consumeContextMenu (menu) {
  console.info(`
    .................
    .................
    .................
    .................
    .................
    .................
    .................`,
    menu,
    `.................
    .................
    .................
    .................
  `)
  window.conte = menu
}

export function provideContextMenu () {
  return {
    addFragment,
    removeFragment,
    clearFragments,
  }
}

const clearFragments = () => menu.clearFragments()

const removeFragment = keyOrItem => menu.removeFragment(keyOrItem)

const addFragment    = (item, properties={}) => {

  if (!item)
    throw new TypeError(`Item is not defined`)

  let fragment   = new model.Fragment({ ...properties, item })
  let disposable = new Disposable(() => menu.removeFragment(fragment))
  console.log(fragment)
  menu.addFragment(fragment)
  console.log(menu, menu.fragments.count())
  subscriptions.add(disposable)
  return fragment
}
