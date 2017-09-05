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

    this.list = this.list.sort(sortByPriority)
  }

  find (fn) {
    return this.list.find(fn)
  }

  async update (detail={}) {
    let children = []

    for (let fragment of this.list) {

      let view = atom.views.getView(fragment)
      if (!view)
        throw new ReferenceError(`Invalid fragment in ContextMenuManager:`, fragment)
      if (typeof fragment.render !== 'function')
        throw new ReferenceError(`Invalid fragment in ContextMenuManager - fragment.render is not a function for the fragment of type ${fragment.toJSON().type}`)

      let element = fragment.render(detail)
      if (typeof element === 'string') {
        let text = element
        element  = document.createElement('section')
        element.innerHTML = text
      }
      else if (!element)
        throw new ReferenceError(`Invalid element returned from fragment.render. Expected HTMLElement, got undefined`)
      else if(!(element instanceof HTMLElement))
        throw new ReferenceError(`Invalid element returned from fragment.render. Expected any of String, HTMLElement or a React component; got`, element.constructor)

      element.classList.add('section')
      view.clear()
      view.append(element)
      children.push(view)
    }
    return children
  }

}

function sortByPriority (a, b) {
  let x = -a.properties.get('priority') || 0
  let y = -b.properties.get('priority') || 0
  return x < y ? -1 : x > y ? 1 : 0
}
