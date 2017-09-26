'use babel'
import Fragment from './Fragment'

function dispatch (item, origin) {
  let detail = item.commandDetail
  let event  = new CustomEvent(item.command, { detail })
  item.element.dispatchEvent(event, { detail })
  origin.stopImmediatePropagation()
}


export default class MenuFragment extends Fragment {

  constructor (props) {
    super(props)
    this.properties.set('name', 'menu')
  }

  getEntries (detail) {

    // Resolve entries for the context menu
    let entries = atom.contextMenu.templateForEvent(detail.event)
    if (!entries.length)
      return

    // Inject a reference to the target element
    // into the returned entries
    let { element } = detail
    return entries.map(item => Object.assign({}, item, { element }))
  }

  render (detail) {
    let entries = this.getEntries(detail)
    let list = document.createElement('ul')

    for (let item of entries) {
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
