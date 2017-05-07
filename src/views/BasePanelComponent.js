'use babel'

import React, { Component } from 'react'
import Emitter from 'events'
import { render } from 'react-dom'
import { CompositeDisposable, Disposable } from 'atom'

import { ERROR } from '../constants'


export default class BasePanelComponent extends Component {

  static location = 'top'
  static priority = 10000
  static className = 'placeholder-variables tool-panel file-templates-panel padded'

  static create (props={}) {

    const panel = atom.workspace.addPanel(
      this.location,
      { className:  this.className,
        priority:   this.priority,
        item:       document.createElement('i'), // Just a placeholder
      }
    )
    let ComponentClass = this
    let instance       = <ComponentClass {...props} panel={panel}  />
    let component      = render(instance, panel.getElement())
    component.panel    = panel

    return component
  }

  constructor (props) {
    super(props)
    this.emitter        = new Emitter()
    this.subscriptions  = new CompositeDisposable()

    // Bind self to the instance methods
    this.destroy        = this.destroy.bind(this)
    this.onDidDestroy   = this.onDidDestroy.bind(this)
  }

  get panel () { return this.props.panel }
  toggle = () => this.panel.toggle()
  hide   = () => this.panel.hide()
  show   = () => this.panel.show()

  onDidDestroy (fnc) {
    this.emitter.on('did-destroy', event => fnc(event, this, this.panel))
  }

  destroy () {
    this.panel.destroy()
    this.subscriptions.dispose()
    // this.emitter.removeAllListeners()
  }

  render () {
    throw new Error(ERROR.PANEL_COMPONENT_RENDER)
    return <div></div>
  }

}
