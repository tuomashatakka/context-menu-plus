
const { min } = Math

class ContextMenuView extends HTMLElement {

  connectedCallback () {
    this.style.setProperty('position', 'fixed')
    this.style.setProperty('z-index', '100000')
    this.hide()
  }

  get gutter () {
    if (!this._gutter) {
      let gutter = parseFloat(getComputedStyle(this).marginBottom)
      if (isNaN(gutter))
        this._gutter = 0
      else
        this._gutter = gutter
    }
    return this._gutter
  }

  get dimensions () {
    let { width, height, top: y, left: x } = this.getBoundingClientRect()
    return { width, height, x, y }
  }

  setPosition (x, y) {
    let num = i => !isNaN(parseInt(i))
    if (num(x)) this.style.setProperty('left', x.toString() + 'px')
    if (num(y)) this.style.setProperty('top',  y.toString() + 'px')
  }

  resolvePosition (mx, my) {
    let { innerWidth: vw, innerHeight: vh } = window
    let { width, height, x, y } = this.dimensions

    x = min(vw - width,  mx || x) - this.gutter
    y = min(vh - height, my || y) - this.gutter

    let maxHeight = vh - y - this.gutter
    this.setMaxHeight(maxHeight)
    this.setPosition(x, y)
  }

  setMaxHeight (h) {
    this.style.setProperty('--max-height', h + 'px')
  }

  async updateFragments (fragments, detail={}) {
    for (let fragment of fragments) {

      // fragment.update(detail)
      let view = atom.views.getView(fragment)

      if (!view)
        throw new ReferenceError(`Invalid fragment in ContextMenuManager:`, fragment)

      let element = view.render(fragment, detail)
      element.classList.add('section')
      this.appendChild(view)
    }
  }

  async show (x, y) {
    this.resolvePosition(x, y)
    this.classList.remove('hidden')
    this.classList.add('open')
  }

  hide () {
    this.classList.add('hidden')
    this.classList.remove('open')
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
