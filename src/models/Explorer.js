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
  }

  getRequestPromise = () => new Promise((resolve, reject) => {
    this.emitter.once('did-submit', (items) => resolve(items))
    this.emitter.once('did-throw-error',  (err) => reject(err))
  })

  async requestFile (initialPath) {

    try {
      if (initialPath)
        this.currentDirectory.setPath(initialPath)
      else
        this.currentDirectory.resetPath()
      this.open()
      this.emitter.emit('did-request-file')
      return await this.getRequestPromise()
    }

    catch (e) {
      this.emitter.emit('will-throw-error', e)
      throw new Error(e)
    }
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
    if (!this.element) {
      let el = createElement()
      this.render(el)
      this.element = el
    }
    this.emitter.emit('did-open', this.element)
    return this.element
  }

  @self
  submit (items) {
    this.close()
    this.emitter.emit('did-submit', items)
  }

  @self
  close () {
    // if (this.element)
    //   this.element.remove()
    this.emitter.emit('did-close', this.element)
  }

  render (node) {
    let component = render(
      <BrowseView currentDirectory={this.currentDirectory} />,
      node)
    component.onDidSubmit(this.submit)
    component.onDidClose(this.close)
    component.onDidClear(this.submit.bind(this, []))
  }

  onDidOpen = (callback) => this.emitter.on('did-open', callback)
  onDidClose = (callback) => this.emitter.on('did-close', callback)
  onDidSubmit = (callback) => this.emitter.on('did-submit', callback)
}

function createElement () {
  let el =
    document.querySelector('file-browser-container') ||
    document.createElement('div')
  el.classList.add('file-browser-container')
  return el
}
