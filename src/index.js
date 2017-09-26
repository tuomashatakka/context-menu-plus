'use babel'
//@flow


import { CompositeDisposable, Disposable } from 'atom'
import settngs from './config'
import createMenuView from './views/ContextMenuView'
import createFragmentView from './views/FragmentView'
import SF from './models/StaticFragment'
import { Component } from 'react'
import { Fragment, ContextMenu, MenuFragment } from './models'


export type FragmentItem = HTMLElement | string | Component<any>
export type FragmentProperties = {
  key?: string | number | void,
  name?: string | number | void,
  priority?: number | void,
  item?: FragmentItem,
}
export type ContextualMenuAPI = {
  addFragment: (item: FragmentItem, props: FragmentProperties) => Fragment,
  removeFragment: () => void,
  clearFragments: () => void,
}


export let menu: ContextMenu
let subscriptions
let watchSubscription: Disposable
let ns   = "atom-workspace"
let pack = "context-menu-plus"
let command: { string?: string } = {
  toggle:  'toggle',
  enable:  'enable',
  disable: 'use-native-menu',
}

const cmd = (name: string): Disposable => atom.commands.add(ns, `${pack}:${command[name]}`, () => menu[name]())

export const config = require('../config.json')

export function initialize () {
  watchSubscription = require('./develop')(pack)
}

export function activate () {

  let menuFragment = new MenuFragment()
  let testFragment = new SF()
  subscriptions    = new CompositeDisposable()
  menu             = new ContextMenu()

  subscriptions.add(
    cmd('toggle'),
    cmd('enable'),
    cmd('disable'),
    // atom.commands.add(ns, `${pack}:tree-view-decorz`, decorateTreeView),
    settngs.observe(settngs.update),
    atom.config.observe(`${pack}.contextMenuEnabled`, onConfigChange),
    atom.views.addViewProvider(ContextMenu, model => createMenuView(model)),
    atom.views.addViewProvider(Fragment, model => createFragmentView(model)),
    atom.keymaps.add(ns, { 'meta-ctrl-c o': command.toggle })
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
  watchSubscription.dispose()
  subscriptions.dispose()
  menu.disable()
}

export function consumeContextMenu (menu: ContextualMenuAPI) {
  window.conte = menu
}

export function provideContextMenu (): ContextualMenuAPI {
  return { addFragment, removeFragment, clearFragments }
}

function clearFragments () {
  menu.clearFragments()
}
function removeFragment (keyOrItem: string | Fragment) {
  menu.removeFragment(keyOrItem)
}
function addFragment (item: FragmentItem, properties: FragmentProperties={}): Fragment {
  if (!item)
    throw new TypeError(`Item is not defined`)
  let fragment   = new Fragment({ ...properties, item })
  let disposable = new Disposable(() => menu.removeFragment(fragment))
  menu.addFragment(fragment)
  subscriptions.add(disposable)
  return fragment
}
