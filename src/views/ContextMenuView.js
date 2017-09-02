class ContextMenuView extends HTMLElement {

  connectedCallback () {
    this.style.setProperty('position', 'fixed')
    this.style.setProperty('z-index', '100000')
    this.hide()
  }

  dispatch (item, origin) {
    let event  = new CustomEvent(item.command)
    let detail = item.commandDetail
    item.element.dispatchEvent(event, { detail })
    origin.stopImmediatePropagation()
    this.hide()
  }

  set entries (items=[]) {
    console.warn("Setting entries for ContextMenuView", items.length)
    let old  = this.querySelector('ul')
    let list = document.createElement('ul')

    for (let item of items) {
      let el = document.createElement('li')
      el.textContent = item.label
      if (item.submenu)
        el.setAttribute('class', 'has-children')
      if (item.command)
        el.addEventListener('click', this.dispatch.bind(this, item), true)
      list.appendChild(el)
    }

    if (old)
      old.remove()

    this.appendChild(list)
  }

  hide () {
    this.classList.add('hidden')
    this.classList.remove('open')
  }

  getPosition () {
    let { top: y, left: x } = this.getBoundingClientRect()
    return { x, y }
  }

  setPosition (x, y) {
    let num = i => !isNaN(parseInt(i))
    if (num(x)) this.style.setProperty('left', x.toString() + 'px')
    if (num(y)) this.style.setProperty('top',  y.toString() + 'px')
  }

  resolveMaximumHeight () {
    let gutter = parseFloat(getComputedStyle(this).marginBottom)
    let { y }  = this.getPosition()
    gutter     = isNaN(gutter) ? 0 : gutter
    this.setHeight(window.innerHeight - y - gutter)
  }

  setHeight (h) {
    this.style.setProperty('--max-height', h + 'px')
  }

  show (x, y) {
    this.setPosition(x, y)
    this.resolveMaximumHeight()

    this.classList.remove('hidden')
    this.classList.add('open')
  }
}

customElements.define('atom-context-menu', ContextMenuView)
module.exports = (model) => {
  let view = document.createElement('atom-context-menu')
  view.model = model
  model.item = view
  document.body.appendChild(view)
  return view

}
