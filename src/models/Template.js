'use babel'

import { templateManager } from '../templates'
import { handleCommandKeys, resolveIcon, toggleMarkerClass } from '../utils'
import { placeholderQuery, placeholderEndQuery } from '../constants'
import { Range, Point } from 'atom'
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

    let iterator  = new Point(0, 0)
    let lines = this.editor.buffer.getLines()
    let component = TemplateVariableAssignmentPanel.create()
    this.markers = []
    // this.replace()

    const addVariableInput = ({ marker, decor, range }) => {

      // Replace the editor's text
      component.text = this.editor.buffer.getTextInRange(range)

      const accept = () => {
        console.error("N O T I C E M E S E N P A I ! 2", {marker})
        marker.valid = false
        next()
        toggleMarkerClass(marker, 'unassigned', 'resolved', 'manually')
      }

      // Bind event handlers
      component.onDidChange(() =>
        this.editor.buffer.setTextInRange(range, component.text))

      component.onKeyDown(event => { handleCommandKeys(event, {
        accept,
        reject:  () => component.destroy(), }) })
    }

    const next = () => (this.markers.length) ?
      addVariableInput(this.markers.shift()) :
      component.destroy()

    const addMarker = (start, end) => {
      // let {
      //   row: y,
      //   column: x, } = point
      // let endPt  = new Point(y, x + lines[y].substr(x).search(placeholderEndQuery))
      // let range  = new Range(point, endPt)
      let range  = new Range(start, end)
      let marker = this.editor.markBufferRange(range, { invalidate: 'never', maintainHistory: true })
      let decor  = this.editor.decorateMarker(marker, { type: 'highlight', class: 'template-variable unassigned' })
      this.markers.push({ marker, decor, range })
    }

    const iterateLine = (rem) => {
      if (!rem || rem.length < 4)
        return

      let match = rem.match(placeholderQuery)
      console.info("match", { match, rem, iter: iterator.copy()})
      if (!match)
        return false

      let { index } = match
      let len   = match[0].length
      let nudge = index + len
      let start = iterator.copy().translate([0, index])
      let end = start.copy().translate([0, len])

      addMarker(start, end)
      iterator = iterator.traverse([0, nudge])
      return iterateLine(rem.substr(nudge))
    }

    for (let n in lines) {
      let stream = lines[n]
      iterator = iterator.traverse([1, 0])
      iterateLine(stream)
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
