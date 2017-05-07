'use babel'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Disposable, CompositeDisposable, Directory, TextEditor } from 'atom'
import { extname, basename, join, sep } from 'path'
import { existsSync } from 'fs'
import { templateManager } from '../templates'
import Template from '../models/Template'
import { bindDisposableEvent, bindControlKeys, bindNavigationKeys, dir } from '../utils'
import Toolbar from './components/ToolbarComponent'
import List from './components/ListComponent'


class DialogContents extends Component {

  constructor (props) {
    super(props)
    this.state = {
      errors: [],
    }
  }

  render () {
    let { children } = this.props
    return <div>
      <div className='alert text-error'>
        {this.state.errors.map((err, n) => <p key={n}>{err}</p>)}
      </div>
      {children}
    </div>
  }
}


export default class Dialog {

  constructor (name) {

    this.errors = []
    this.name   = name
    this.item   = document.createElement('div')

    this.subscriptions = new CompositeDisposable()
    this.insertEditor = this.insertEditor.bind(this)
    this.templates.add('index_with_content.js', 'kikki hiir on [[pelle]]')
    this.render()

    this.subscriptions.add(bindDisposableEvent(
      'keydown', bindControlKeys.bind(this), this.input.element))

    this.subscriptions.add(bindDisposableEvent(
      'keydown', event => bindNavigationKeys.call(this, event,
        function() {
          console.info(arguments, this)
        }
      ), this.input.element))
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
    let editor = this.panel.input

    return editor
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

  show () {
    this.errors = []
    this.selectedTemplate = null
    this.panel.show()
  }

  hide = () =>
    this.panel.hide()

  getTitle = () =>
    this.name

  set value (text) {
    this.input.setText(dir(text))
    this.input.moveToEndOfLine()
    // input.selectToBeginningOfWord()
  }

  get value () {
    return this.input.getText().trim() }

  set error (err) {
    this.errors.push(err)
    this.component.setState({ errors: this.errors })
  }

  get error () {
    return this.errors }

  get templates () {
    if (!this._tmpl)
      this._tmpl = templateManager()
    return this._tmpl
  }

  submit () {
    this.errors = []
    let path = this.value

    if (path && path[0] !== sep)
      path = join(atom.project.getPaths()[0], path)

    try {

      // If the given path already exists, do not overwrite it
      // but rather display an error.
      if (existsSync(path)) {
        this.error = `${path} already exists`
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
          resolver.then(editor => this.selectedTemplate
            ? this.selectedTemplate.apply(editor)
            : null)
        this.panel.hide()
      }
    }

    catch({ message }) {
      this.error = message
    }
  }

  insertEditor (host) {
    host.appendChild(this.input.element)
    this.input.element.focus()
  }

  setTemplate (item) {
    this.selectedTemplate = item ? new Template(item) : null
    this.render()
  }

  render () {
    this.item = this.item || document.createElement('div')

    let noTemplate = {
      name: 'No template',
      icon: 'icon-x',
      path: null,
      type: null,
      selected: () => !this.selectedTemplate || this.selectedTemplate.path === null,
    }

    let templates = this.templates.getAll().map(item => {
      return {
        name: basename(item.path),
        type: extname(item.path),
        path: item.path,
        selected: () => this.selectedTemplate && item.path === this.selectedTemplate.path,
      }
    })

    let buttons   = [
      { text: 'Cancel', action: () => this.hide() },
      { text: 'Save', action: () => this.submit(), style: 'success' }]

    this.component = render(
      <DialogContents>
        <section ref={this.insertEditor}/>
        <Toolbar buttons={buttons} />
        <List
         items={[noTemplate].concat(templates)}
         select={(item) => this.setTemplate(item)}
        />
      </DialogContents>,

      this.item )
  }
}
