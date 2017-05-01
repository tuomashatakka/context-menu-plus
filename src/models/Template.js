'use babel'

import { templateManager } from '../templates'
import { handleCommandKeys, resolveIcon, toggleMarkerClass } from '../utils'
import { placeholderQuery } from '../constants'
import { Range, CompositeDisposable } from 'atom'
import { basename, extname } from 'path'
import TemplateVariableAssignmentPanel from '../views/TemplateVariableAssignmentPanel'
// const resolveVariablesFromRawContent = (content, template) => {
//   content = `→ asd →; ${content}`;
// }


export default class Template {

  constructor ({ icon, path }) {
    this.path = path
    this.name = basename(path)
    this.icon = resolveIcon({ icon })
    this.extension = extname(path)
    window.activeTemplate = this

  }

  get file () {

    return templateManager().get(this.path)

  }

  get content () {

    return callback => new Promise(resolve => {
      let { file } = this
      let template = this
      let execute  = content =>
          resolve({ content, template })
      if(file)
        file.read().then(execute)
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

    const bfr = () => this.editor.buffer
    let iterator  = bfr().getFirstPosition()
    let endPosition = bfr().getEndPosition()
    let component = TemplateVariableAssignmentPanel.create()
    this.markers = []
    // this.replace()

    const addVariableInput = ({ marker, decor, range }) => {

      // Replace the editor's text
      component.text = this.editor.buffer.getTextInRange(range)
      let subscriptions = new CompositeDisposable()

      const reject = () =>
        component.destroy()

      const accept = () => {
        // mirrorChanges()
        marker.valid = false
        subscriptions.dispose()
        toggleMarkerClass(marker, 'unassigned', 'resolved', 'manually')
        next()
      }

      const mirrorChanges = () => {
        if (marker.isValid())
          bfr().setTextInRange(range, component.text)
      }

      const handleCommand = event =>
        handleCommandKeys(event, { accept, reject, })

      // Bind event handlers
      subscriptions.add(component.onDidChange(mirrorChanges))
      subscriptions.add(component.onKeyDown(handleCommand))

    }

    const next = () => {
      console.log(this.markers.length, this.markers) // FIXME: Remove

      return (this.markers.length) ?
      addVariableInput(this.markers.shift()) :
      component.destroy()
    }

    const addMarker = (start, end=null) => {
      let range  = end ? new Range(start, end) : start
      let marker = this.editor.markBufferRange(range, { invalidate: 'never', maintainHistory: true })
      let decor  = this.editor.decorateMarker(marker, { type: 'highlight', class: 'template-variable unassigned' })
      this.markers.push({ marker, decor, range })
    }

    while (iterator.compare(endPosition) < 1) {

      let scanRn = new Range(iterator, endPosition)
      bfr().scanInRange(
        placeholderQuery,
        scanRn,
        result => {
          let { range } = result
          addMarker(range)
          iterator = iterator.traverse(range.end)
        })
    }

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
