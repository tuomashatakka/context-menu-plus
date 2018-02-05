'use babel'
import Fragment from './Fragment'

function dispatch (item, initial, origin) {
  let detail = item.commandDetail
<<<<<<< HEAD
  let { element, command } = item


  let r = atom.commands.dispatch(element, 'mousedown', detail)
  let r2 =atom.commands.dispatch(element, 'click', detail)
  console.log(r, r2)
  let result = atom.commands.dispatch(element, command, detail)

  if (!result) {
    let event  = new CustomEvent(command, { detail })
    event.target = initial.event.target
    element.dispatchEvent(event, { detail })
  }

  console.warn("dispatched", { item, event, initial, origin })
=======
  let event  = new CustomEvent(item.command, { detail })
  item.element.dispatchEvent(event, { detail })
>>>>>>> 8c66aa9f636518db8fe6c470d087acada21eb649
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
        el.addEventListener('click', dispatch.bind(this, item, detail), true)
      list.appendChild(el)
    }
    return list
    // let element = super.render()
  }
}
