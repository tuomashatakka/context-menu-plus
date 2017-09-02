'use babel'
import React from 'react'
import { render } from 'react-dom'
import self from 'autobind-decorator'

export default class ContextMenu {

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
    if (!this.item || !this.item.parentElement)
      return false
    let { display, opacity } = getComputedStyle(this.item)
    return display !== 'none' && opacity > 0
  }

  displayMenu (entries, properties={}) {
    console.log("displaying the menu with", entries.length, "entries and the following properties:", properties)
    let [ x, y ] = properties.clientPosition
    let { element } = properties

    this.item.entries = entries.map(item => Object.assign({}, item, { element }))
    this.item.show(x, y)

    // render(
    //   <ContextMenuView entries={entries} />,
    //   this.item)
  }

  @self
  hideMenu () {
    console.log("Hiding menu", this.isOpen(), this)
    if (this.isOpen())
      this.item.hide()
  }
}
