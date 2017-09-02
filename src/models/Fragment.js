'use babel'

export default class ContextMenuFragment {

  constructor (props={}) {

    let properties = new Map()
    let item

    for (let [key, value] in props)
      if (key === 'item') item = value
      else properties.set(key, value)

    this.item = item
    this.properties = properties
  }

  update (detail={}) {
    // TODO
  }

  render (detail={}) {
    let element

    if (!this.item)
      throw new TypeError(`Trying to render a fragment with no item`)

    if (this.item.render)
      element = this.item.render(this)

    else if (typeof this.item === 'string') {
      element = document.create('section')
      element.innerHTML = this.item
    }

    if (!(this.item instanceof HTMLElement))
      throw new TypeError(`Feagment.render return value should be an instance of HTMLElement. Got ${element.constructor ? element.constructor.name : 'undefined'}`)

    return element
  }
}
