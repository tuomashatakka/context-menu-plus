'use babel'

import React from 'react'
import prop from 'prop-types'

const ErrorList = ({ errors }) => {

  if (!errors || !errors.length)
    return null

  return <ol className='error-messages'>
    {errors.map(error =>
      <li
        key={error}
        className='error-message'>
        {error.toString()}
      </li>
    )}
  </ol>
}

ErrorList.propTypes = {
  errors: prop.arrayOf(prop.object).isRequired,
}

export default ErrorList
