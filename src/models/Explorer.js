'use babel'

import React from 'react'
import { render } from 'react-dom'
import Emitter from 'events'
import self from 'autobind-decorator'

import Directory from './Directory'
import BrowseView from '../views/Browse'

export default class Explorer {

  constructor (path='.') {
    this.currentDirectory = new Directory(path)
    this.emitter = new Emitter()
    this.open()
  }

  getRequestPromise = () => new Promise((resolve, reject) => {
    this.emitter.one('did-submit', (items) => resolve(items))
    this.emitter.one('did-close',  () => reject())
  })

  async requestFile (initialPath) {
        if (initialPath)
      this.currentDirectory.setPath(initialPath)
    else
      this.currentDirectory.resetPath()

    this.open()

    this.emitter.emit('did-request-file')
    return await this.getRequestPromise()
  }

  async requestDirectory () {
    this.emitter.emit('did-request-directory')
  }

  /**
   * Open the explorer view
   * @method open
   */

  @self
  open () {
    let el = createElement()
    this.render(el)
    this.element = el
    this.emitter.emit('did-open')
  }

  @self
  submit (items) {
    this.close()
    this.emitter.emit('did-submit', items)
  }

  @self
  close () {
    this.element.remove()
    this.emitter.emit('did-close')
  }

  render (node) {

    let component = render(
      <BrowseView
        currentDirectory={this.currentDirectory}
      />,
      node
    )
    component.onDidSubmit(this.submit.bind(this))
    component.onDidCancel(this.close.bind(this))
    component.onDidClear(this.submit.bind(this, []))
  }
}

function createElement () {
  let el =
    document.querySelector('file-browser-container') ||
    document.createElement('div')
  el.classList.add('file-browser-container')
  return el
}
