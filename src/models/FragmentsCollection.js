'use babel'
// @flow

import Fragment from './Fragment'
import type { FragmentItem } from '..'

const assertElement = (element: FragmentItem) => { if(!(element instanceof HTMLElement))
  throw new ReferenceError(
    `Invalid element returned from fragment.render. Expected one of [String, HTMLElement, ReactComponent];
     got ${element.constructor.name}`)
}

const assertFragmentHasView = (fragment: Fragment, view) => { if (!view)
  throw new ReferenceError(
    `Invalid fragment in ContextMenuManager: ${fragment.toString()}`)
}

const assertFragmentHasRenderMethod = (fragment: Fragment) => { if (typeof fragment.render !== 'function')
  throw new ReferenceError(
    `Invalid fragment in ContextMenuManager - fragment.render is not a function
     for the fragment of type ${fragment.toJSON().type}`)
}

export default class FragmentsCollection {

  list: Set<Fragment>

  constructor () {
    this.list = new Set()
  }
  add (...fragments: Array<Fragment>) {
    fragments.forEach((fragment: Fragment) =>
    fragment instanceof Fragment &&
    this.list.add(fragment))
  }
  count() {
    return this.list.size
  }
  all () {
    return Array.from(this.list).sort(byPriority)
  }
  find (fn: (item: Fragment) => boolean): Fragment {
    return Array.from(this.list).find(fn)
  }
  has (fr: Fragment) {
    let item = this.find((item) => item && item.isEqual(fr))
    return item ? true : false
  }
  get (fr: string | Fragment): Fragment {
    if (typeof fr === 'string')
      return this.find((item): boolean => item.key === fr)
    return this.find((item): boolean => item.isEqual(fr))
  }
  clear () {
    for (let fragment of this.list)
      fragment.destroy()
    this.list.clear()
  }

  async update (detail={}): Promise<Array<HTMLElement>> {
    let children = []
    let list = this.all()

    for (let fragment of list) {

      let view = atom.views.getView(fragment)
      assertFragmentHasView(fragment, view)
      assertFragmentHasRenderMethod(fragment)

      let element = fragment.render(detail)
      if (typeof element === 'string') {
        let text = element
        element  = document.createElement('section')
        element.innerHTML = text
      }
      else assertElement(element)

      element.classList.add('section')
      view.clear()
      view.append(element)
      children.push(view)

    }
    return children
  }

}

/* eslint-disable complexity */
function byPriority (a, b) {
  let x  = a.properties.get('priority') || 0
  let y  = b.properties.get('priority') || 0
  return   x < y
    ?  1 : x > y
    ? -1 : 0
}
/* eslint-enable complexity */
