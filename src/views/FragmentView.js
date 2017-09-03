class FragmentElement extends HTMLElement {
  connectedCallback () {
  }
}

customElements.define('context-fragment', FragmentElement)

module.exports = model => {
  // Array
  //   .from(this.children)
  //   .forEach(o => o.remove())
  let view     = document.createElement('context-fragment')
  model.item   = view
  let priority = model.properties.get('priority')
  view.style.setProperty('--priority', priority)

  return view
}
