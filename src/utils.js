'use babel'

import { ADVANCE_KEYS, CANCEL_KEYS, IS_VISIBLE } from './constants'
import { dirname, join, resolve, sep } from 'path'
import { Disposable } from 'atom'
// import FileIcons from '../default-file-icons'


export const isVisible = el =>
  el.getAttribute('style').search(IS_VISIBLE) > -1

// Check if the provided key is within the given haystack
// and return a Promise that is either resolved if the key
// was found; or rejected if the key was not found
export const keypress = ({ key }, haystack=[]) => new Promise(
  (resolve, reject) => haystack.indexOf(key) > -1 ? resolve() : reject())


// Check whether a key event should trigger
// advance or cancel handler
export const handleCommandKeys = (
    event  = {}, {
    accept = ()=>{},
    reject = ()=>{},
    pass   = ()=>{}, }) =>
  keypress(event, ADVANCE_KEYS).then(accept).catch(() =>
  keypress(event, CANCEL_KEYS).then(reject).catch(pass))


// FIXME: Icons for template listing - returns the atom's
// boring default file or directory icon depending on the
// type as it stands.
//
// TODO:
//  1. Should be extended to consume file icons like tree-view
//  2. Own icons perhapsss....? :v

export const icon = arg => resolveIcon(arg)
export const resolveIcon = ({ type, icon }) =>
  `icon icon-${type ? type.substring(1) : 'directory'} ` + (icon || 'icon-file') // FileIcons.iconClassForPath(path, "tree-view")


/**
 * Takes a DisplayMarker instance and a list of class names
 * and toggles each of them for the given marker
 *
 * @method toggleMarkerClass
 * @param  {DisplayMarker} marker Target marker for which the classes should be toggled
 * @param  {Array} classList      Rest parameter; An array of classes that should be toggled
 * @return {DisplayMarker}        The marker that was given as a parameter, with its class
 *                                property modified
 */

export const toggleMarkerClass = (marker, ...classList) => {
  let i = { add: [], remove: [] }
  let className = marker.properties.class.split(/\s+/)
  let { add, remove } = classList.reduce((accrual, c) => {
    if (className.indexOf(c) > -1) accrual.remove.push(c)
    else accrual.add.push(c)
    return accrual
  }, i)

  marker.properties.class = className
    .filter(c => remove.indexOf(c)  === -1)
    .concat(add)
    .join(' ')
  return marker
}


export const getSettingsViewModule = (name=null) => {
  let mod = atom.packages.getLoadedPackage('settings-view')
  return name ?
    require(join(dirname(mod.getMainModulePath()), name)) :
    mod.mainModule
}


export function bindDisposableEvent (name, handler, target=null) {
  target = target || this
  let dispatch  = (event) => handler(event)
  let dispose = new Disposable(
    () => target.removeEventListener(name, dispatch))
  target.addEventListener(name, dispatch)
  return dispose
}


export const shouldClose = ({ key, ctrlKey }) =>
  CANCEL_KEYS.indexOf(key) > -1 ||
  ctrlKey && key.toLowerCase() === 'w'


export const isPgKey = key =>
  key.startsWith('Page') ? key.substr(4).toLowerCase() : false


export const isArrowKey = key =>
  key.startsWith('Arrow') ? key.substr(5).toLowerCase() : false


export function bindControlKeys ({key, ctrlKey}, resolve, reject) {
  if (['Enter', 'Tab'].indexOf(key) > -1)
    return resolve ? resolve(this) : this.submit()
  else if(shouldClose({ key, ctrlKey }))
    return reject ? reject(this) : this.hide()
}


const MULTIPLIER = 10

export function bindNavigationKeys ({key, ctrlKey, shiftKey}, handler) {

  let pg = isPgKey(key)
  let ar = isArrowKey(key)
  let direction = pg || ar

  if (!direction)
    return

  let amount = atom.config.get('editor.scrollSensitivity') || 45
    * (pg ? 2 : 1)
    * (ctrlKey || shiftKey ? MULTIPLIER : 1)

  handler({ key, amount, direction })
}


export const toRelativePath = path => {
  let paths = atom.project.getPaths()
  let root = paths.length === 1 ? paths[0] : null
  path = resolve(path ? dirname(path) : root || '.') + sep
  if (root && path.startsWith(paths[0]))
    return path.substr(root.length + 1)
  return path
}


export const dir = path => toRelativePath(path)
