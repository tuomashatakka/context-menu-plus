'use babel'

import prop from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { CompositeDisposable } from 'atom'

import { getTemplates } from '../templates'
import SettingsGeneralPanel from './SettingsGeneralPanel'
import List from './components/ListComponent'
import Toolbar from './components/ToolbarComponent'


const confirm = message => atom.confirm({
    message,
    buttons: {
      'Yes': () => true,
      'No':  () => false,
    }
  })


export default class SettingsTemplatePanel extends Component {

  static propTypes = {
    toolbar: prop.array,
    name:    prop.string,
    icon:    prop.string,
    host:    prop.object,
  }

  constructor (props) {
    super(props)
    this.name = props.name
    this.icon = props.icon
    this.subscriptions = new CompositeDisposable()
    this.state = {
      templates: getTemplates()
    }
  }

  static create (props={}) {

    let host           = SettingsGeneralPanel()
    let ComponentClass = this
    let instance       = <ComponentClass {...props} host={host} />
    let component      = render(instance, host.element)
    return new Proxy(
      component, {
        get: (obj, attr) => obj[attr] || host[attr] || null
      })
  }

  destroy () {
    this.props.host.destroy()
    this.subscriptions.dispose()
    this.element.remove()
  }

  render () {
    let { templates } = this.state
    let { toolbar }   = this.props

    return (

      <section className='section settings-panel'>

        <div className={`block section-heading icon icon-${this.icon}`}>
          {this.name}
        </div>

        <header>
          <Toolbar buttons={toolbar} />
          <h3>Template files</h3>
        </header>

        <List
          items={templates}
          displayToggleButton={false}
          select={item => atom.workspace.open(item.path)}
          actions={[(item, key) =>
            <i
              key={key}
              className='icon icon-x'
              onClick={e => {

                e.preventDefault()

                if (!confirm(`Delete ${item.name}?`))
                  return false

                item.template.remove()
                this.setState({ templates: getTemplates() })
                return false
              }} />
          ]}
        />

      </section>

    )
  }
}
