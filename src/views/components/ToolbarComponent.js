'use babel'
import React from 'react'
import prop from 'prop-types'
import { icon } from '../../utils'


const Toolbar = ({ buttons }) => {

   return <div className='block btn-toolbar pull-right'>
     {buttons.map(({ text, action, style, icon: ico }, n) =>
       <button
        key={n}
        className={`btn btn-` + (style || 'default') + (ico ? ' icon icon-' + icon({icon: ico}) : '')}
        onClick={action}>
         {text}
       </button>
     )}
   </div>
}

Toolbar.propTypes = {
  buttons: prop.array.isRequired,
}

export default Toolbar
