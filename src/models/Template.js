'use babel'

import { templateManager } from '../templates'
import { handleCommandKeys, resolveIcon, toggleMarkerClass } from '../utils'
import { placeholderQuery } from '../constants'
import { Range, CompositeDisposable } from 'atom'
import { basename, extname } from 'path'
import TemplateVariableAssignmentPanel from '../views/TemplateVariableAssignmentPanel'
import TemplateVariableMarker from './TemplateVariableMarker'



export default class Template {

  constructor ({ icon, path }) {
    this.markers          = []
    this.consumedMarkers  = []
    this.extension        = extname(path)
    this.name             = basename(path)
    this.icon             = resolveIcon({ icon })
    this.path             = path
  }

  get active () {
    return this.markers.length ? true : false
  }

  get file () {
    return templateManager().get(this.path)
  }

  get content () {
    return callback =>

      new Promise(resolve => {
        let { file } = this
        let template = this
        let content  = ''

        if(file)
          file.read().then(content => resolve({ content, template }))

        else
          resolve({ content, template })

      })
      .then(c => callback(c))
      .catch(c => { console.error(c) })
  }

  get constants () {
    return {
      ...process.env
    }
  }

  restoreMarker (n=0) {
    if (this.consumedMarkers && this.consumedMarkers.length) {
      let mk = this.consumedMarkers.pop()
      this.markers.unshift(mk)
      return mk
    }
    return false
  }

  consumeNextMarker () {
    if (this.markers.length) {
      let mk = this.markers.pop()
      this.consumedMarkers.push(mk)
      return mk
    }
    return false
  }

  addMarker (range) {
    this.markers = this.markers || []
    let marker = new TemplateVariableMarker(this, range)
    this.markers.push(marker)
    return marker
  }

  populate () {

    let iterator    = this.editor.buffer.getFirstPosition()
    let endPosition = this.editor.buffer.getEndPosition()
    let component   = TemplateVariableAssignmentPanel.create()
    this.markers    = []

    const addVariableInput = marker => {

      // Replace the text of the input field
      component.update(marker.content)

      // Bind event handlers
      let subscriptions = new CompositeDisposable()
      subscriptions.add(component.onDidChange(() => marker.update(component.text)))
      subscriptions.add(component.onDidAccept(() => proceed(marker)))
      subscriptions.add(component.onNavigate(n => n < 0 ? prev() : next()))
      // subscriptions.add(component.onKeyDown((ev) => {
      //   console.info(ev)
      //   return ev.key === '+' ? prev() : null
      // }))

      // Handler callbacks
      const proceed = marker => {
        marker.invalidate()
        subscriptions.dispose()
        next()
      }

    }

    const prev = () => {
      let mk = this.restoreMarker()
      if (mk)
        addVariableInput(mk)
      else
        component.destroy()
    }

    const next = () => {
      let mk = this.consumeNextMarker()
      if(mk)
        addVariableInput(mk)
      else
        component.destroy()
    }

    // while (iterator.compare(endPosition) < 1) {
      // let scanRn = new Range(iterator, endPosition)

      this.editor.buffer.backwardsScan(placeholderQuery, /*scanRn,*/ result => {
        this.addMarker(result.range)
        // iterator = iterator.traverse(result.range.end)
      })

    // }

    // Initiate assignment
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

  // replace (key=null, val=null) {
  //
  //   return this.editor.buffer.replace(placeholderQuery, (_, original) => {
  //     let constants = this.constants
  //     let fallbackValue = constants[key || original] || original
  //
  //     atom.notifications.addInfo("replaced " + original + " with " + val + " " + JSON.stringify(constants))
  //     if (!key || !val)
  //       return fallbackValue
  //     return key.indexOf(original) > -1 ? val : original
  //   })
  //
  // }

}
