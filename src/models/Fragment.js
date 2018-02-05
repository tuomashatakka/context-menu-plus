'use babel'
// @flow

import type Fragment from './Fragment'
import type { FragmentProperties } from '..'

export default class ContextMenuFragment {

  item: HTMLElement

  static equal (f1, f2): boolean {

    // If either of the compared items is not an instance
    // of ContextMenuFragment, items are not equal fragment-wise
    if (!(f1 instanceof ContextMenuFragment && f2 instanceof ContextMenuFragment))
      return false

    // If either items or keys of the compared items match,
    // the fragments are equal
    let keys  = f1.key  && f1.key === f2.key
    let items = f1.item && f1.item === f2.item
    if (keys || items)
      return true

    // Iterate through all JSON's properties and return false
    // if any of the properties does not equal to its counterpart
    let one = f1.toJSON()
    let two = f2.toJSON()
    for (let [ key, val ] of Object.entries(one))
      if (two[key] !== val)
        return false
    return true

  }

  isEqual (fragment: Fragment) {
    return ContextMenuFragment.equal(this, fragment)
  }

  /* eslint-disable complexity */
  constructor (props: FragmentProperties={}) {

    let properties = new Map()
    let item

    for (let [key, value] of Object.entries(props))
      if (key === 'item') item = value
      else properties.set(key, value)

    if (typeof item === 'string') {
      let el = document.createElement('div')
      el.innerHTML = item
      item = el
    }
    this.item = item
    this.properties = properties
  }
  /* eslint-enable: complexity */

  get key () {
    return (
      this.properties.get('key') ||
      this.properties.get('name') ||
      this.item
    )
  }

  update (detail={}) {
    this.detail = detail
  }

  render (/*  detail={}  */) {
    if (!this.item)
      throw new ReferenceError(`
        ContextMenuFragment must be passed an item, or
        when rendering a subclass of ContextMenuFragment,
        the subclass must alternatively override a render
        method that returns a String or a HTMLElement.
      `)
    return this.item
  }

  destroy () {
    if (this.item)
      this.item.remove()
  }

  toJSON () {
    let item = this.item
    if (!item)
      try { item = this.render() }
      catch (e) { item = null }

    let data = { item, type: this.constructor.name }
    for (let [ key, value ] of this.properties.entries())
      data[key] = value

    return data
  }
}
