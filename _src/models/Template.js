'use babel'

import { CompositeDisposable } from 'atom'
import { basename, extname } from 'path'
import { unlink } from 'fs'

import { templateManager } from '../templates'
import { resolveIcon } from '../utils'
import { placeholderQuery } from '../constants'
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
    this.getConstantValue = this.getConstantValue.bind(this)
  }



  // Section: Variables & template variable providers

  /**
   * Get an object that contains the
   * available runtime constants
   * @method constants
   * @return {object}  A list of the env constants in the current process
   */
  get constants () {
    return {
      ...process.env
    }
  }

  /**
   * Try to find a matching value for the provided key
   * The value is resolved by iterating through the registered instances
   * of TemplateVariableProviders until a value is found, or there are
   * no providers left
   * @method getConstantValue
   * @param  {string}         key The name that is used as a search term
   * @return {Array}              A list of found values, or null if none
   *                              of the providers finds a matching value.
   */
  getConstantValue (key) {
    let constantKey = Object.keys(this.constants).find(con => key === con)
    console.info({key, constantKey})
    if (constantKey)
      return this.constants[constantKey]
    return key
  }



  // Section: Populating the template

  /**
   * Get the status for the template variable assignment
   * @method active
   * @return {Bool}   `true` if the assignment is not finished
   *                  `false` otherwise
   */
  get active () {
    return this.markers.length ? true : false
  }

  /**
   * Add a new TemplateVariableMarker
   * @method addMarker
   * @param  {Range}  range  The range in the TextEditor
   *                         corresponding the variable
   * @param  {Array}  match  RegExp match array for the
   *                         file content scan
   * @param  {string}  key   The name of the variable
   */
  addMarker ({ range, match }) {

    this.markers = this.markers || []
    let template = this
    let marker   = new TemplateVariableMarker({ template, range, key: match })
    marker.resolveValue()
    this.markers.push(marker)
    return marker
  }

  // TODO: Change to use undo/redo & groupHistory stuff
  restoreMarker () {
    this.editor.undo()
  }

  // TODO: Change to use undo/redo & groupHistory stuff
  consumeNextMarker () {
    if (this.markers.length) {
      let mk = this.markers.pop()
      this.consumedMarkers.push(mk)
      return mk
    }
    return false
  }

  /**
   * Initialize the variable assignment sequence and toggle the
   * UI for assigning the values for the variables
   * @method populate
   */
  populate () {
    let component   = TemplateVariableAssignmentPanel.create()
    let checkpoint  = this.editor.createCheckpoint()
    this.markers    = []

    const addVariableInput = marker => {

      // Replace the text of the input field
      component.update(marker.content)

      // Bind event handlers
      let subscriptions = new CompositeDisposable()
      subscriptions.add(component.onDidChange(() => marker.update(component.text)))
      subscriptions.add(component.onDidAccept(() => proceed(marker)))
      subscriptions.add(component.onNavigate(n => n < 0 ? this.editor.undo() : this.editor.redo()))

      const proceed = marker => {
        marker.invalidate()
        subscriptions.dispose()
        next()
      }
    }

    const updateCheckpoint = () => {
      this.editor.groupChangesSinceCheckpoint(checkpoint)
      checkpoint = this.editor.createCheckpoint()
    }

    const next = () => {
      updateCheckpoint()
      let mk = this.consumeNextMarker()
      if(mk)
        addVariableInput(mk)
      else
        component.destroy()
    }


    // Prepopulate constants & initiate the assignment sequence
      this.editor.buffer.backwardsScan(placeholderQuery, /*scanRn,*/ result => {
        this.addMarker(result)
      })

    next()
  }

  /**
   * Assign an instance of a TextEditor for the Template
   * to be used in variable resolving & assignment
   * @method apply
   * @param  {TextEditor} textEditor The editor with the template file open
   */
  apply (textEditor) {

    if (!textEditor || typeof textEditor.setText !== 'function')
      return null

    let promiseResolver = ({ content='\n', template }) => {

      try {
        content += (!content || !content.endsWith('\n')) ? '\n' : ''
      }
      catch(err) {
        return
      }

      textEditor.setText(content)
      this.cachedContent = content
      this.editor        = textEditor

      if (-1 < content.search(placeholderQuery))
        template.populate(textEditor)

      return content
    }

    return this.content(d => promiseResolver(d))
  }



  // Section: File IO & text content handling

  /**
   * Get the filesystem's File instance for the template file
   * @method file
   * @return {File} The file related to the calling template
   *                instance
   */
  get file () {
    return templateManager().get(this.path)
  }

  /**
   * Get the contents for the
   * template file as a raw text
   * (asynchronously)
   * @method content
   * @return {Promise}  A Promise providing the
   *                    file contents upon resolution
   */
  get content () {
    let template = this
    let content  = ''
    let { file } = this

    if(file)
      return cb => file.read().then(content => cb({ content, template }))

    return cb => cb({ content, template })
  }

  /**
   * Remove the related file from the storage folder
   * @method remove
   */
  remove = () => unlink(this.file.path)

  /**
   * Read the contents of the file synchronously and return
   * its text contents as a raw string. If file does not exist,
   * an empty string is returned.
   * @method toString
   * @return {string} Contents of the file linked to the template
   */
  toString () {
    let f = this.file
    if (!f)
      return ''
    return f.readSync()
  }

}
