'use babel'

import React from 'react'
import prop from 'prop-types'
import { sep, parse } from 'path'

const Breadcrumbs = ({ path, onClick }) => {

  let { name } = parse(path)
  path = path.split(sep)
  path[0] = "Root"
  if (!name.length)
    path = path.slice(0, 1)

  const getPathFragment = n =>
    sep + path.slice(1, n + 1).join(sep)

  return <ul className='breadcrumbs list-group'>
    {path.map((dir, n) => {
      const click = () => onClick(getPathFragment(n))
      return <li key={n}
        className='list-item'
        onClick={click}>
        {dir}
      </li>
    })}
  </ul>
}

Breadcrumbs.propTypes = {
  path: prop.string,
  onClick: prop.function,
}

export default Breadcrumbs
