'use babel'
import Fragment from './Fragment'

function dispatch (item, origin) {
  let event  = new CustomEvent(item.command)
  let detail = item.commandDetail
  item.element.dispatchEvent(event, { detail })
  origin.stopImmediatePropagation()
}

export default class MenuFragment extends Fragment {

  constructor (props) {
    super(props)
    this.properties.set('name', 'menu')
  }

  render (detail) {
    let list = document.createElement('ul')

    for (let item of detail.entries) {
      let el = document.createElement('li')
      el.textContent = item.label
      if (item.submenu)
        el.setAttribute('class', 'has-children')
      if (item.command)
        el.addEventListener('click', dispatch.bind(this, item), true)
      list.appendChild(el)
    }

    return list
    // let element = super.render()
  }
}
