'use babel'

import React from 'react'
import { icon } from '../../utils'


export const toggleNext = ({ target: el }) => {
  el.parentElement.classList.toggle('collapsed')
  el.parentElement.classList.toggle('expanded')
  el.nextElementSibling.classList.toggle('hidden')
}

const TemplateComponent = (item) => {

  const selected  = item.selected()
  const className = `${icon(item)} ${selected ? 'selected' : ''}`

  const dispatch  = event =>

    typeof item.select === 'function' ?
    item.select(item) :
    dummyTempDispatch(event, item)

  return (
    <li
     key={item.name}
     className={className}
     onClick={dispatch}>

      {item.name}
    </li> )
}

const dummyTempDispatch = (...arg) => console.log(...arg)

export default TemplateComponent
