class FragmentElement extends HTMLElement {

  connectedCallback () {
  }

  render (fragmentModel, detail) {
    Array
      .from(this.children)
      .forEach(o => o.remove())

    fragmentModel.item = this
    let el = fragmentModel.render(detail)
    this.appendChild(el)
    return el
  }
}

customElements.define('context-fragment', FragmentElement)

module.exports = (model) => {
  let view = document.createElement('context-fragment')
  return view
}
