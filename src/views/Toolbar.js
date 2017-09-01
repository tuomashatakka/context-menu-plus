'use babel'

import React from 'react'
import prop from 'prop-types'


const Toolbar = ({ setOptions }) => {

  const option = (detail) => () => setOptions(detail)

  const Button = ({ options, children }) =>
    <button
      className='btn'
      onClick={option(options)}>
      {children}
    </button>

  const content = <div className='toolbar'>

    <div className='btn-group'>

      <Button options={{ itemsDisplay: 'grid' }}>
        Grid view</Button>

      <Button options={{ itemsDisplay: 'list' }}>
        List view</Button>

    </div>

    <div className='btn-group'>
      <button
        className='btn'
        onClick={() => setOptions({ textSize: '0.65em'})}>
        Tiny</button>
      <button
        className='btn'
        onClick={() => setOptions({ textSize: '0.8em'})}>
        Small</button>
      <button
        className='btn'
        onClick={() => setOptions({ textSize: '1em'})}>
        Normal</button>
      <button
        className='btn'
        onClick={() => setOptions({ textSize: '1.2em'})}>
        Large</button>
      <button
        className='btn'
        onClick={() => setOptions({ textSize: '1.5em'})}>
        Huge</button>
    </div>
  </div>

  Button.propTypes = {
    children: prop.any.isRequired,
    options: prop.object.isRequired,
  }

  Toolbar.propTypes = {
    setOptions: prop.func.isRequired,
  }
  
  return content
}

export default Toolbar
