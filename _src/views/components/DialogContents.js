'use babel'

import React, { Component } from 'react'
import prop from 'prop-types'


const li = (contents, n) => <li key={n}>{contents}</li>


export default class DialogContents extends Component {

  static propTypes = {
    children: prop.array,
  }

  constructor (props) {

    super(props)

    this.state = {
      errors: [],
    }
  }

  render () {

    const { children } = this.props
    const { errors }   = this.state
    const errorsList   =
      <ul className='error-messages block padded'>
        {errors.map(li)}
      </ul>

    return (
      <div className='dialog-contents'>
        {errorsList}
        {children}
      </div>
    )
  }
}
