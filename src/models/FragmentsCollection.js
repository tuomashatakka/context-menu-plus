'use babel'

import Fragment from './Fragment'

export default class FragmentsCollection {

  constructor () {
    this.list = []
  }

  add (...fragments) {
    fragments.forEach(fragment =>
      fragment instanceof Fragment &&
      this.list.push(fragment)
    )
  }

  find (fn) {
    return this.list.find(fn)
  }

}
