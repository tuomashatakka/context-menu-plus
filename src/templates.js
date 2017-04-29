'use babel'

import { CompositeDisposable, Directory, File } from 'atom'
import { join } from 'path'
import Template from './models/Template'

export default class TemplateInterface {

  constructor () {
    const dirname = 'file-templates'
    const path = join(atom.getStorageFolder().getPath(), dirname)
    this.directory = new Directory(path)
    this.directory
      .exists()
      .then((exists) => {
        if(!exists)
          this.directory.create()
      })
  }

  getTemplate (name) {
    let item = this.get(name)
    if (!item)
      return new Template()
    return new Template(item)
  }

  getAll () {
    return this.directory.getEntriesSync()
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
}

let templateInterface
export const templateManager = () =>
  templateInterface
  ? templateInterface
  : templateInterface = new TemplateInterface()
