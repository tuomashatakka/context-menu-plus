'use babel'

import self from 'autobind-decorator'

import FragmentsCollection from './FragmentsCollection'

export default class ContextMenu {

  constructor (...fragments) {
    this.fragments   = new FragmentsCollection()
    fragments.forEach(fr => this.fragments.add(fr))
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

    // Resolve entries for the context menu
    let entries = atom.contextMenu.templateForEvent(ev)
    let { clientX: x, clientY: y, target: element } = event

    // Display the custom menu
    this.displayMenu (entries, { element, clientPosition: [ x, y ] })

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
  async displayMenu (items=[], properties={}) {
    let { element, clientPosition } = properties
    let fragments = this.fragments.list.sort(sortByPriority)
    let manager   = this
    let entries   = items.map(item => Object.assign({}, item, { element }))
    let detail    = { entries, properties, manager }
    let [ x, y ]  = clientPosition
    let view = atom.views.getView(this)

    await view.updateFragments(fragments, detail)
    await view.show(x, y)
    // render(
    //   <ContextMenuView entries={entries} />,
    //   this.item)
  }
}

function sortByPriority (a, b) {
  if (!a.priority || a.priority < b.priority)
    return 1
  if (!b.priority || b.priority > a.priority)
    return -1
  return 0
}
