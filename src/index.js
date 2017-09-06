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

// function decorateTreeView (tree) {
//
//   tree
//     .element
//     .querySelectorAll('[class*="-active-item"]')
//     .forEach(ob => ob.classList.remove('has-active-item'))
//   tree
//     .revealActiveFile()
//
//   let el = tree.selectActiveFile()
//   let activeElements = new Set()
//   if (!el)
//     return activeElements
//   el.classList.add('is-active-item')
//
//   while ((el = el.parentElement) &&
//          !el.classList.contains('tree-view-root')) {
//
//     activeElements.add(el)
//     el.classList.add('has-active-item')
//   }
//
//   console.log(activeElements)
//   return activeElements
// }

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
    // atom.commands.add(ns, `${pack}:tree-view-decorz`, decorateTreeView),
    settngs.observe(settngs.update),
    atom.config.observe(`${pack}.contextMenuEnabled`, onConfigChange),
    atom.views.addViewProvider(model.ContextMenu, model => createMenuView(model)),
    atom.views.addViewProvider(model.Fragment, model => createFragmentView(model)),
    atom.keymaps.add(ns, { 'ctrl-alt-*': command.toggle })
  )

  menu.fragments.add(menuFragment, testFragment)
  menu.enable()

  // setTimeout(()=> {
  //   let tree = atom.packages
  //     .getLoadedPackage('tree-view')
  //     .mainModule
  //     .getTreeViewInstance()
  //   let treDeco = () => decorateTreeView(tree)
  //   tree.element
  //     .addEventListener('mouseup', treDeco)
  //   this.subscriptions.add(new Disposable(() =>
  //     tree.element.removeEventListener('mouseup', treDeco)))
  // }, 1500)
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

type fragment = {
  asd: number
};

export function consumeContextMenu (menu) {
  console.info('.................')
  console.info('.................')
  console.info('.................')
  console.info('.................')
  console.info('.................')
  console.info('.................')
  console.info('.................')
  console.info(menu)
}

export function provideContextMenu () {
  return ({
    addFragment:    model.Fragment,
    removeFragment: (properties): fragment => menu.fragments.add(new model.Fragment(properties))
  })
}
