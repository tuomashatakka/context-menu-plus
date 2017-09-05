'use babel'
import Fragment from './Fragment'

function dispatch (item, origin) {
  let detail = item.commandDetail
  let event  = new CustomEvent(item.command, { detail })
  console.warn("dispatching", item, event)
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
      if (item.submenu) {
        el.setAttribute('class', 'has-children')
        el.addEventListener('mouseover', () => {
          atom.notifications.addWarning("Submenus not yet supported")
        })
        el.addEventListener('mouseout', () => {
          atom.notifications.addWarning("Submenus not yet supported", { description: 'Lol <progress indeterminate>' })
        })
      }
      if (item.command)
        el.addEventListener('click', dispatch.bind(this, item), true)
      list.appendChild(el)
    }

    return list
    // let element = super.render()
  }
}
