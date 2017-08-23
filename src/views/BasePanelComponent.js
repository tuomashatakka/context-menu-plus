'use babel'

import prop from 'prop-types'
import React, { Component } from 'react'
import Emitter from 'events'
import { render } from 'react-dom'
import { CompositeDisposable } from 'atom'

import { ERROR } from '../constants'


export default class BasePanelComponent extends Component {

  static location = 'top'
  static priority = 10000
  static className = ['placeholder-variables', 'tool-panel', 'file-templates-panel', 'padded']

  static propTypes = {
    panel: prop.object.isRequired,
  }

  static create (props={}) {

    const ComponentClass = this
    const panelProps = {
      priority:   this.priority,
      className:  this.className.join(' '),
      item:       document.createElement('i'), }
    const panel = atom.workspace.addPanel(this.location, panelProps)

    let component      = render(<ComponentClass {...props} panel={panel}  />, panel.getElement())
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

  render () { /* eslint-disable */
    throw new Error(ERROR.PANEL_COMPONENT_RENDER)
    return <div></div>
  }

}
