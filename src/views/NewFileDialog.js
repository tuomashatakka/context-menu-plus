'use babel'
import React from 'react'
import { render } from 'react-dom'
import { Disposable, Directory, TextEditor } from 'atom'
import { join, sep, basename, dirname } from 'path'
import { existsSync } from 'fs'
import { getTemplates, getNullTemplateItem, compareTemplates } from '../templates'
import Template from '../models/Template'
import Toolbar from './components/ToolbarComponent'
import List from './components/ListComponent'
import DialogContents from './components/DialogContents'
import BaseDialog from './components/Dialog'


export default class Dialog extends BaseDialog {

  constructor (name) {
    super({ name })

    this.insertEditor = this.insertEditor.bind(this)
    this.rootPath = '/'
    this.render()

  }

  destroy () {
    this.subscriptions.dispose()
  }

  get className () {
    if (!this.__classname)
      this.__classname = `filepath-prompt modal-${this.name}`
    return this.__classname
  }

  get input () {
    return this.panel.input
  }

  get panel () {
    if (this._panel)
      return this._panel

    let { className, getTitle, item, } = this
    let panel   = atom.workspace.addModalPanel({ item, getTitle, className, })
    let editor  = new TextEditor({ mini: true })
    this._panel = panel
    panel.input = editor
    panel.hide()
    this.subscriptions.add(new Disposable(() => panel.destroy()))
    return panel
  }

  set value (text) {

    let rel       = basename(text)
    this.rootPath = dirname(text)

    this.render()
    this.input.setText(rel)
    this.input.moveToBeginningOfLine()
    this.input.selectToEndOfWord()
  }

  get value () {
    return this.input.getText().trim()
  }

  submit () {
    this.errors = []
    let path = join(this.rootPath, this.value)
    // if (path && path[0] !== sep)
    //   path = join(atom.project.getPaths()[0], path)

    try {

      // If the given path already exists, do not overwrite it
      // but rather display an error.
      if (existsSync(path)) {
        this.error = `File ${this.value} already exists (${path})`
        if (!path.endsWith(sep))
          atom.workspace.open(path)
      }

      // If the input ends with a path separator, create a new
      // directory to the given location.
      else if (path.endsWith(sep)) {
        (new Directory(path)).create()
        this.panel.hide()
      }

      // If the input evaluates to a filename (it does not end
      // with a separator character), open a new pane item for
      // the given input as the path for the item. If a template
      // is selected, apply it to the newly opened pane item.
      else {

        let resolver = atom.workspace.open(path)
        if (this.selectedTemplate)
          resolver.then(editor =>
            this.selectedTemplate ?
            this.selectedTemplate.apply(editor) : null)

        this.panel.hide()
        // this.panel.destroy()
      }
    }

    catch({ message }) {
      this.error = message
    }
  }

  show () {
    this.errors = []
    this.selectedTemplate = null
    this.panel.show()
  }

  select (item) {
    this.selectedTemplate = item ? new Template(item) : null
    this.render()
  }

  insertEditor (host) {
    host.appendChild(this.input.element)
    this.input.element.focus()
  }

  isSelected = () =>
    this.selectedTemplate &&
    this.selectedTemplate.path &&
    this.selectedTemplate.path.length

  pageUp () {
    let { templates } = this
    let index = this.selectedTemplate ? templates.findIndex(item => this.selectedTemplate.path == item.path) : 0
    if (index > 0)
      this.select(templates[index - 1])
  }

  get templates () {
    return [ getNullTemplateItem(() => !this.isSelected()) ]
      .concat(getTemplates()
      .map(item => ({
        ...item,
        selected: () => compareTemplates(this.selectedTemplate, item)
      })))
  }

  pageDown () {
    let { templates } = this
    let index = this.selectedTemplate ? templates.findIndex(item => this.selectedTemplate.path == item.path) : 0
    if (index > -1 && index < templates.length - 1)
      this.select(templates[index + 1])
  }

  render () {

    let { templates } = this


    let buttons   = [
      { text: 'Cancel', action: () => this.hide() },
      { text: 'Save', action: () => this.submit(), style: 'success' }]

    this.component = render(
      <DialogContents>
        <section className='padded text-subtle'>
          <span className='badge'>
            <code>
              {this.rootPath
                .split('/')
                .splice(1)
                .map(o => <span className='breadcrumb'>{o}</span>)
              }
            </code>
          </span>
        </section>

        <section ref={this.insertEditor}/>

        <Toolbar buttons={buttons} />

        <List
          items={templates}
          select={(item) => this.select(item)}
        />

      </DialogContents>,
      this.item )
  }
}
