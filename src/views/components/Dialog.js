'use babel'

import React from 'react'
import prop from 'prop-types'
import { CompositeDisposable } from 'atom'
import { bindDisposableEvent,
         bindControlKeys,
         bindNavigationKeys } from '../../utils'


export default class Dialog {

  static propTypes = {
    children: prop.array,
  }

  constructor ({ name }) {
    this.errors = []
    this.name   = name
    this.item   = document.createElement('div')
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(

      bindDisposableEvent(
        'keydown', bindControlKeys.bind(this), this.input.element),

      bindDisposableEvent(
        'keydown', event =>
          bindNavigationKeys.call(this, event, this.handleNavigationKey.bind(this)),
          this.input.element
      )

    )
    this.render = this.render.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
  }

  handleNavigationKey ({ amount, direction }) {
    console.log(this) // FIXME: Remove

    if (direction === 'up')
      this.pageUp(amount)
    else if (direction === 'down')
      this.pageDown(amount)
  }

  pageUp () {}
  pageDown () {}

  render () {

    let { children } = this.props

    return (
      <section>
        {children}
      </section>
    )
  }

  show () {
    this.errors = []
    this.panel.show()
  }

  hide = () =>
    this.panel.hide()

  getTitle = () =>
    this.name

  set error (err) {
    this.errors.push(err)
    if (!err || !err.length)
      this.errors = []
    this.component.setState({ errors: this.errors })
  }

  get error () {
    return this.errors
  }
}
