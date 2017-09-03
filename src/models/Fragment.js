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
    this.detail = detail
  }

  render (/*  detail={}  */) {
    throw new ReferenceError(`Subclasses of ContextMenuFragment must implement a render method that returns a String or a HTMLElement`)
  }

  toJSON () {
    let item = this.item
    if (!item)
      try { item = this.render() }
      catch (e) { item = null }

    let data = { item, type: this.constructor.name }
    for (let [ key, value ] of this.properties.entries())
      data[key] = value

    return data
  }
}
