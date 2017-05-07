'use babel'

import React from 'react'
import prop from 'prop-types'
import { icon } from '../../utils'


/**
 * Utility function for the toggle button
 * to toggle the hidden class for the immediate
 * next sibling of the button.
 *
 * @method toggleNext
 * @param  {HTMLElement} target
 */

const toggleNext = ({ target: el }) => {
  el.parentElement.classList.toggle('collapsed')
  el.parentElement.classList.toggle('expanded')
  el.nextElementSibling.classList.toggle('hidden')
}


const style = {
  clear: 'both',
  width: 'auto',
  // top: '-1.5rem',
  // right: 0,
  // left: 0,
  // position: 'relative'
}

const List = ({ items, select, displayToggleButton=true }) => {

  const toggleButton = displayToggleButton ?
    <button
     className='btn btn-sm icon icon-chevron-right expanded'
     onClick={toggleNext}
     style={{
       fontSize: '8px',
       margin: '0 8px 0 0'
     }}>
      Use a template
    </button>
    : null

  return <div className='file-templates-list select-list expanded'>

    {toggleButton}

    <ol className='list-group' style={style}>

      {items.map(item => {
        let { name, selected, icon: ico } = item
        let iconElement = <i className={ico ? `icon icon-${ico}` :icon(item)} />
        let labelElement = <span className='title'>{item.name}</span>
        let props = {
          key:       name,
          onClick:   () => select(item),
          className: [ 'list-item', selected() ? ' selected' : '', ].join(' ') }

        return <li {...props}>
          {iconElement}
          {labelElement}
        </li>
      })}
    </ol>
  </div>
}


// Prop types for the `List` component
export default List
List.propTypes = {
  displayToggleButton: prop.bool,
  select: prop.func,
  items: prop.array,
}
