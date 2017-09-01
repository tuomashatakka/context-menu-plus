'use babel'

import React from 'react'
import prop from 'prop-types'

import ListItem from './ListItem'

const ListView = ({ title, items, onClick, isSelected }) => {

  const stateFor = (item) => {
    let state = []
    if (isSelected(item))
      state.push('selected')
    return state.join(' ')
  }

  const LI = item =>
    <ListItem
      key={item.path || item}
      path={item.path || item}
      state={stateFor(item.path || item)}
      onClick={onClick}
    />

  if (!items.length)
    return null

  else
    return <section>
      <h4>{title}</h4>
      <ol className='select-list list-group'>
        {items.map(LI)}
      </ol>
    </section>
}

ListView.propTypes = {
  isSelected: prop.func.isRequired,
  onClick:    prop.func.isRequired,
  items:      prop.array.isRequired,
  title:      prop.string,
}

export default ListView
