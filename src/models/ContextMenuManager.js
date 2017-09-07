'use babel'

import self from 'autobind-decorator'
import FragmentsCollection from './FragmentsCollection'


export default class ContextMenu {

  constructor (...fragments) {
    this.fragments   = new FragmentsCollection()
    fragments.forEach(fr => this.fragments.add(fr))
  }

  addFragment (fragment) {
    console.log("fragment .......", fragment, this.fragments.count)
    let hasFragment = this.fragments.has(fragment)

    console.log(hasFragment )
    if (!hasFragment)
      this.fragments.add(fragment)
    console.log("fragment .......", fragment, this.fragments)
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
    document.addEventListener('click', this.hideMenu)
    this.enabled = true
  }

  disable () {
    window.removeEventListener('contextmenu', this.handleContextMenuEvent, true)
    document.removeEventListener('click', this.hideMenu)
    this.enabled = false
  }

  @self
  hideMenu () {
    if (this.isOpen())
      this.item.hide()
  }

  @self
  toggle (state=null) {
    if (state === false || state === null && this.enabled)
      return this.disable()
    if (state === true || state === null && !this.enabled)
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
  async displayMenu (event, properties={}) {
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
