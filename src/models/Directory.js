'use babel'
import { readdirSync } from 'fs'
import { resolve } from 'path'
import { exists, isFile, isDirectory } from '../utils'

export default class Directory {

  constructor (path='.') {
    this.basePath = resolve(path)
  }

  static from (path) {
    try {
      return new Directory(path)
    }
    catch (e) {
      return null
    }
  }

  get files () {
    if (!this._files)
      this._files = this.ls.filter(isFile)
    return this._files
  }

  get directories () {
    if (!this._directories)
      this._directories = this.ls
        .filter(isDirectory)
        .map(Directory.from)
        .filter(exists)
    return this._directories
  }

  get ls () {
    if (!this._items) {
      let toAbsolutePath = (item) => resolve(this.path, item)
      let items = this._items || readdirSync(this.path)
      this._items = items.map(toAbsolutePath)
    }
    return this._items
  }

  get path () {
    let path = this._path || this.basePath
    return resolve(path)
  }

  set path (path='.') {
    this._path  = resolve(this._path, path)
    this._items = null
    this._files = null
    this._directories = null
  }

  setPath (path) {
    if (!path)
      throw new TypeError(`Empty path passed as an argument for a call to Explorer.setPath`)
    this.path = path
  }

  resetPath () {
    this.path = this.basePath
  }

}
