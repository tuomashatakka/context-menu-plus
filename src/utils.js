'use babel'
import { statSync } from 'fs'

export function stringOrNull (props, propName, componentName) {
  let provided = props[propName]
  let isNull = provided === null
  let isString = typeof provided !== 'string'
  if (!isNull && !isString)
    return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`)
}
