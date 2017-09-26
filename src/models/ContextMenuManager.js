'use babel'
// @flow

import self from 'autobind-decorator'
import FragmentsCollection from './FragmentsCollection'
import type Fragment from './Fragment'
import type { FragmentProperties } from '../index'

export default class ContextMenu {

  constructor (...fragments: Array<Fragment>) {
    this.fragments = new FragmentsCollection()
    fragments.forEach(fr => this.fragments.add(fr))
  }

  addFragment (fragment) {

    let hasFragment = this.fragments.has(fragment)
    if (!hasFragment)
      this.fragments.add(fragment)
  }

  removeFragment (fragmentOrKey) {
    if (this.fragments.has(fragmentOrKey))
      this.fragments.remove(fragmentOrKey)
    this.fragments.update()
  }

  clearFragments () {
    this.fragments.clear()
    this.fragments.update()
  }

  enable () {
    window.addEventListener('contextmenu', this.handleContextMenuEvent, true)
    document.addEventListener('click', this.conditionallyHideView)
    this.enabled = true
  }

  disable () {
    window.removeEventListener('contextmenu', this.handleContextMenuEvent, true)
    document.removeEventListener('click', this.conditionallyHideView)
    this.enabled = false
  }

  @self
  conditionallyHideView (event: MouseEvent) {
    let view = atom.views.getView(this)
    if (!event.defaultPrevented && !view.isWithinBounds(event.pageX, event.pageY))
      view.hide()
  }

  @self
  hideMenu () {
    if (this.isOpen())
      this.item.hide()
  }

  @self
  toggle (state=null) {
    if (state === false || (state === null && this.enabled))
      return this.disable()
    else
      return this.enable()
  }

  @self
  handleContextMenuEvent (ev) {

    // Extract the key parameters from the event and
    // display the custom context menu
    let { clientX: x, clientY: y, target: element } = event
    this.displayMenu (event, { element, position: [ x, y ] })

    // Prevent the original menu from showing
    ev.stopImmediatePropagation()
  }

  isEnabled () {
    return this.enabled ? true : false
  }

  isOpen () {
    if (!this.item || !this.item.parentElement) return false
    let { display, opacity } = getComputedStyle(this.item)
    return (
      !this.item.classList.contains('hidden') &&
      display !== 'none' && opacity > 0)
  }

  @self
  async displayMenu (event: Event, properties: FragmentProperties={}) {
    let [ x, y ] = properties.position
    let manager  = this

    let view     = atom.views.getView(this)
    let detail   = { ...properties, event, manager }
    let children = await this.fragments.update(detail)

    view.contentElement.append(...children)
    view.show(x, y)
    // render(
    //   <ContextMenuView entries={entries} />,
    //   this.item)
  }
}
