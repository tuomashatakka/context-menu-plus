'use babel'

import { Directory, File } from 'atom'
import { join, basename, extname } from 'path'
import { statSync } from 'fs'
import Template from './models/Template'
import { TMPL_DIR_NAME } from './constants'

const ftype = path => statSync(path) ? 'file' : 'file-directory'

const formatTemplate = ({ path }) => ({
  path,
  icon:     ftype(path),
  type:     extname(path)  || 'directory',
  name:     basename(path) || 'unnamed',
  template: new Template({ path, icon: ftype(path) }),
  selected: () => false })

const formatEntries = entries =>
  entries.map(formatTemplate)

export const getTemplates = (filter=()=>true) =>
  templateManager().getAll().filter(filter)

export const compareTemplates = (a, b) =>
  a && b && a.path === b.path

export const getNullTemplateItem = selected => ({
  name: 'No template',
  icon: 'x',
  path: null,
  type: null,
  selected: (typeof selected === 'function' ? selected() : selected) || false
})

export default class TemplateInterface {

  constructor () {
    this.path = atom
      .getStorageFolder()
      .pathForKey(TMPL_DIR_NAME)
  }

  set path (path) {
    this.directory = new Directory(path)
    this.directory
      .exists()
      .then(exists => !exists ? this.directory.create() : null)
  }

  get path () {
    return this.directory.getPath()
  }

  getTemplate (name) {
    let item = this.get(name)
    if (!item)
      return new Template()
    return new Template(item)
  }

  getAll () {
    // TODO: Decorate output
    return formatEntries(this.directory.getEntriesSync())
  }

  has (fname) {
    return (this.directory.contains(fname))
  }

  get (fname) {
    if (!fname)
      return null
    if (this.has(fname))
      return this.directory.getFile(
        (fname.startsWith(this.directory.path))
        ? fname.substr(this.directory.path.length)
        : fname)
    return false
  }

  add (name, contents) {
    if (this.has(name))
      return false
    this.set(name, contents)
  }

  set (name, contents=null) {
    let path = join(this.directory.path, name)
    let file = new File(path)
    file.create()
    if (contents)
      file.write(contents)
  }

  toJSON = () =>
    this.getAll()

  toString = () =>
    this.getAll().map(entry => entry.name)

}

let templateInterface
export const templateManager = () =>
  templateInterface
  ? templateInterface
  : templateInterface = new TemplateInterface()
