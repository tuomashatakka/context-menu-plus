'use babel'

import { ADVANCE_KEYS, CANCEL_KEYS } from './constants'
import { dirname, join } from 'path'

// Check if the provided key is within the given haystack
// and return a Promise that is either resolved if the key
// was found; or rejected if the key was not found
export const keypress      = ({ key }, haystack=[]) => new Promise(
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
    return accrual }, i)
  marker.properties.class = className
    .filter(c =>
      remove.indexOf(c)  === -1)
    .concat(add)
    .join(' ')
  return marker }


export const getSettingsViewModule = (name=null) => {
  let mod = atom.packages.getLoadedPackage('settings-view')
  return name ?
    require(join(dirname(mod.getMainModulePath()), name)) :
    mod.mainModule
}
