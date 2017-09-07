class FragmentElement extends HTMLElement {
  connectedCallback () {
  }

  clear () {
    this.innerHTML = ''
  }
}

customElements.define('context-fragment', FragmentElement)

module.exports = model => {
  // Array
  //   .from(this.children)
  //   .forEach(o => o.remove())
  let priority = model.properties.get('priority')
  let view     = document.createElement('context-fragment')
  view.model   = model
  view.style.setProperty('--priority', priority)

  return view
}
