
const { min } = Math

class ContextMenuView extends HTMLElement {

  // static get observedAttributes () { return [ 'x', 'y' ] }
  //
  // attributeChangedCallback (attr, prev, value) {
  //   if (attr === 'x') {
  //     this.style.setProperty('left', value.toString() + 'px')
  //   }
  // }

  connectedCallback () {
    this.style.setProperty('position', 'fixed')
    this.style.setProperty('z-index', '100000')
    this.hide()
  }

  get contentElement () {
    return this.firstElementChild || this.appendChild(document.createElement('div'))
  }

  async show (x, y) {
    this.classList.add('open')
    this.classList.remove('hidden')
    this.resolvePosition(x, y)
    this.compensateOverflow()
  }


  clear () {
    this.contentElement.innerHTML = ''
  }

  hide () {
    this.classList.add('hidden')
    this.classList.remove('open')
  }

  setPosition (x, y) {
    let num = i => !isNaN(parseInt(i))
    if (num(x)) this.style.setProperty('left', x.toString() + 'px')
    if (num(y)) this.style.setProperty('top',  y.toString() + 'px')
  }

  getMaxHeight () {
    return window.innerHeight - this.dimensions.y - this.gutter
  }

  setMaxHeight (h) {
    this.style.setProperty('--max-height', h + 'px')
  }

  get dimensions () {
    let { width, height, top: y, left: x } = this.getBoundingClientRect()
    return { width, height, x, y }
  }

  resolvePosition (mx, my) {
    let { innerWidth: vw, innerHeight: vh } = window
    let { width, x, y } = this.dimensions
    x = min(vw - width,  mx || x) - this.gutter
    y = my || y
    this.setMaxHeight(vh - y - this.gutter)
    this.setPosition(x, y)
  }

  compensateOverflow () {
    let delta
    let vh = window.innerHeight
    let { top: y, minHeight } = getComputedStyle(this)
    minHeight = parseInt(minHeight)
    y = parseInt(y)
    let edge = vh - y - this.gutter
    if (edge < minHeight)
      delta = minHeight - edge

    if (delta > 0) {
      y -= Math.ceil(delta / 1.5)
      this.setPosition(null, y)
      requestAnimationFrame(this.compensateOverflow.bind(this))
    }
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
}

customElements.define('atom-context-menu', ContextMenuView)

module.exports = (model) => {
  let view = document.createElement('atom-context-menu')
  view.model = model
  model.item = view
  document.body.appendChild(view)
  return view

}
