'use babel'

import { templateManager } from '../templates'
import { Range } from 'atom'
import { basename, extname } from 'path'

const placeholderQuery = /\[\[([\w-_\.]+)\]\]/g
const placeholderEndQuery = /\]\]/g
const resolveVariablesFromRawContent = (content, template) => {
  content = `→ asd →; ${content}`;
}

const resolveIcon = ({ type, icon }) =>
  `icon icon-${type ? type.substring(1) : 'directory'} ` +
  (icon || 'icon-file')
  // FileIcons.iconClassForPath(path, "tree-view")

export default class Template {

  constructor ({ icon, path }) {
    this.path = path
    this.name = basename(path)
    this.icon = resolveIcon({ icon })
    this.extension = extname(path)
    window.activeTemplate = this
  }

  get file () {
    let manager = templateManager()
    console.info("MANAGER:", { manager, template: this, path: this.path })
    return manager.get(this.path)
  }

  get content () {

    return callback => new Promise(resolve => {
      let { file } = this
      let template = this
      let execute  = content =>
          resolve({ content, template })
      if(file)
        file
        .read()
        .then(execute)
      else execute('')
    })
    .then(callback)
    .catch(callback)
  }

  get constants () {
    return {
      'pelle': 'avocado',
    }
  }

  replace (key=null, val=null) {
    return this.editor.buffer.replace(placeholderQuery, (_, original) => {
      let constants = this.constants
      let fallbackValue = constants[key || original] || original

      atom.notifications.addInfo("replaced " + original + " with " + val + " " + JSON.stringify(constants))
      if (!key || !val)
        return fallbackValue
      return key.indexOf(original) > -1 ? val : original
    })
  }

  populate () {

    let className = 'file-templates-panel placeholder-variables'
    let location  = 'top'
    let priority  = 10000
    let item  = document.createElement('section')
    let panel = atom.workspace.addPanel(location, { item, className, priority })
    let lines = this.editor.buffer.getLines()
    let btn   = document.createElement('button')

    item.setAttribute('class', 'padded')
    item.innerHTML = "<h3>Assign template variables</h3>"

    btn.textContent = 'Close'
    btn.setAttribute('class', 'btn')
    btn.addEventListener('click', () => panel.destroy())

    window.placeholderPanel = panel

    this.markers = []
    // this.replace()

    const addVariableInput = ({ marker, range }) => {
      let inputContainer = document.createElement("section")
      inputContainer.innerHTML = '<atom-text-editor mini></atom-text-editor>'
      item.appendChild(inputContainer)
      let input = inputContainer.firstElementChild
      let editor = input.getModel()
      editor.setText(this.editor.buffer.getTextInRange(range))
      let subscription = editor.onDidStopChanging((/*{ changes }*/) => {
        this.editor.buffer.setTextInRange(range, editor.getText())
        // range = range + newRange
      })
      editor.onDidDestroy(() => subscription.dispose())
      input.addEventListener('keydown', ({ key }) => (key === "Enter") ? advance() : null)

      const advance = () => {
        editor.destroy()
        marker.destroy()
        input.remove()
        next()
      }
    }

    const next = () => {
      if (this.markers.length)
        addVariableInput(this.markers.shift())
      else
        panel.destroy()
    }

    for (let n in lines) {
      let line   = lines[n]
      let row    = parseInt(n)
      let col    = line.search(placeholderQuery)

      while (col > -1) {
        let len    = line.substr(col).search(placeholderEndQuery) //+ placeholderEndQuery.source.length
        let editor = this.editor
        let range  = new Range([row, col], [row, col + len])
        let marker = editor.markBufferRange(range)
        let decal  = editor.decorateMarker(marker, { type: 'highlight', class: 'template-variable unassigned' })
        col       += len
        this.markers.push({ marker, decal, range })
      }

    }

    item.appendChild(document.createElement("br"))
    item.appendChild(btn)
    next()
  }

  apply (textEditor) {

    if (!textEditor || typeof textEditor.setText !== 'function')
      return null

    let promiseResolver = this.content(({ content='', template }) => {
      console.info("content in the application.begin:", content)
      try { if (!content || !content.endsWith('\n')) content = content + '\n' }
      catch(err) { content = content ? content + '\n' : '\n' }
      textEditor.setText(content)
      this.cachedContent = content
      this.editor        = textEditor
      console.warn('apply tmpl?:', { content, textEditor, template, self: this})
      if (-1 < content.search(placeholderQuery))
        template.populate(textEditor)
      return content
    })

    return promiseResolver
  }

  toString () {
    let f = this.file
    if (!f)
      return ''
    return f.readSync()
  }

}
