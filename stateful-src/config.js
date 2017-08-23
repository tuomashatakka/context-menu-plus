'use babel'

import filesystem from 'fs'
import { getBase64FromImageUrl, prefix, error } from './utils'

async function resolveValue (val) {

  // Handle basic types
  if (!val)
    val = ''
  else if (val.toJSON)
    val = val.toJSON()
  else if (val.toJS)
    val = val.toJS()
  else if (val.toString)
    val = val.toString()

  // Handle file paths
  if (val.search('/') > -1) {
    try {
      let data = await getBase64FromImageUrl(val)
      val = `url("${data}")`
    }
    catch (data) {
      val = `"${data}"`
    }
  }
  else if(!val.startsWith('#'))
    val = `url('atom://stateful/icons/triniti/${val}.svg')`

  return val
}

function reloadStylesheet (path) {
  let { themes } = atom
  let src = themes.loadLessStylesheet(path)
  themes.applyStylesheet(path, src, 5)
  themes.refreshLessCache()
  return src
}

function applyCss (path, content) {

  if (atom.devMode)
    // eslint-disable-next-line
    console.info(`Writing the less config to\npath ${path}\n---------------------------------\n\n${content}\n\n`)

  let raise = (err) =>
    error(err, `Writing less variables to a file ${path} failed`)

  try {
    content = content + '\n'
    filesystem.writeFile(
      path, content, 'utf8', err =>
      err ? raise(err) : reloadStylesheet(path)) }

  catch(e) {
    raise(e) }

}

export async function writeLessVariable (fp, config={}) {

  async function print (val, ...key) {
    let { name } = require('../package.json')
    let value = await resolveValue(val)
    let keyPath = [ name, ...key ]
    let pre = prefix({ keyPath })
    return `${pre}${value};`
  }

  async function iterate (cat) {
    let promises = Object
      .keys(config[cat] || {})
      .map(key => print(config[cat][key], cat, key))

    return Promise
      .all(promises)
  }

  let stream = []
    .concat(
      await iterate('color'),
      await iterate('icon'))
    .join("\n")

  return applyCss(fp, stream)
}
