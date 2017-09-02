'use babel'

import React from 'react'
import prop from 'prop-types'
import { basename } from 'path'

import FileIcons from '../file-icons'
import { stringOrNull } from '../utils'

const iconClass = (path) => {
  let classes = FileIcons.getService().iconClassForPath(path, "file-explorer")
  if (typeof classes !== 'string')
    classes = classes.join(' ')
  return 'icon ' + classes.replace(',', ' ')
}

const ListItem = ({ onClick, path, state }) =>
  <li
    className={'list-item' + (state ? ' ' + state : '')}
    onClick={(ev) => onClick(path, parseOptions(ev))}>
    <span className={iconClass(path)} />
    <span className='title'>{basename(path)} </span>
    <small className='path text-subtle'>{path} </small>
  </li>

ListItem.propTypes = {
  state:    stringOrNull,
  icon:     stringOrNull,
  path:     prop.string,
  title:    prop.string,
  onClick:  prop.function,
}

export default ListItem

function parseOptions (ev) {
  return {
    inclusive: ev.metaKey || ev.shiftKey
  }
}
