'use babel'
import Fragment from './Fragment'

export default class ActivePathFragment extends Fragment {

  constructor (props) {
    super(props)
    this.properties.set('name', 'static-frag')
    this.properties.set('priority', 100)
  }

  render (detail) {
    let el = document.createElement('div')
    let path = getPath()
    el.innerHTML = path ? "<strong>Path</strong> " + path : ''
    return el
    // let element = super.render()
  }
}

function getPath () {
  let editor = atom.workspace.getActiveTextEditor()
  return editor ? editor.getPath() : null
}
