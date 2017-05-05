'use babel'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { CompositeDisposable, Disposable } from 'atom'
import SettingsGeneralPanel from './SettingsGeneralPanel'
import { templateManager } from '../templates'


const REGEX = { VISIBLE: /display:(?:\s*)(block)/ig }

const attr = function attr (k, v, obj=null) {
  let object = (obj || this)
  object.constructor.name !== 'Window'
}

/**
 * @class SettingsTemplatePanel
 * @extends React.Component
 */
export default class SettingsTemplatePanel extends Component {

  constructor (props) {
    super(props)
    this.name = props.name
    this.icon = props.icon
    this.subscriptions = new CompositeDisposable()
  }

  toJSON = () =>
    this.constructor.toJSON(this)

  static toJSON (obj) {

    const element =
      obj.element =
      document.createElement('i')

    const {
      title,
      icon
    } = obj

    return {
      icon,
      title,
      element,
      getIcon: () => icon,
      getTitle: () => title,
      getElement: () => element,
      toggle: () => obj.toggle(),
      isVisible: () => obj.isVisible(),
      show: () => obj.show(),
      hide: () => obj.hide(),
    }
  }

  focus = () =>
    this.props.host.focus()

  isVisible = () =>
    this.props.host.element
      .getAttribute('style')
      .search(REGEX.VISIBLE) > -1

  toggle = () =>
    this.isVisible() ? this.hide() : this.show()

  static create (props={}) {

    let host           = SettingsGeneralPanel()
    let ComponentClass = this
    let instance       = <ComponentClass {...props} host={host} />
    let component      = render(instance, host.element)
    return new Proxy(
      component, {
        get: (obj, attr, p) => obj[attr] || host[attr] || null
      })
  }

  destroy () {
    this.element.remove()
    this.props.host.destroy()
    this.subscriptions.dispose()
  }

  render () {
    let { children } = this.props

    return (

      <section className='section settings-panel'>

        <div className={`block section-heading icon icon-${this.icon}`}>
          {this.name}
        </div>

        {children}

        <h2 className='block'>Template files</h2>
        <ol className='list-tree'>
        {templateManager().getAll().map(template =>

          <li className='list-item template-item'>
            {template.path}
          </li>
        )}

        </ol>
      </section>
    )
  }
}
