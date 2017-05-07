'use babel'

import React from 'react'
import { Disposable } from 'atom'

import BasePanelComponent from './BasePanelComponent'
import Toolbar from './components/ToolbarComponent'
import { ERROR } from '../constants'
import { bindDisposableEvent, bindControlKeys } from '../utils'


export default class TemplateVariableAssignmentPanel extends BasePanelComponent {

  constructor (props) {
    super(props)
    this.focus   = this.focus.bind(this)
    this.update  = this.update.bind(this)
    this.submit  = this.submit.bind(this)
    this.destroy = this.destroy.bind(this)
    this.setEditorReference = this.setEditorReference.bind(this)
  }

/**
   * Sets the text content for the input field
   * @method text (setter)
   * @param {string} [text=''] The new content for the input field. Defaults to empty string
   */
  set text (text='') { this.editor.setText(text) }

  /**
   * Gets and returns the text for the input field's text buffer
   * @method text (getter)
   * @return {string} Content for the input field
   */
  get text () { return this.editor.getText() }

  onDidAccept (fnc) {
    this.emitter.on('did-accept', fnc)
    return new Disposable(() => this.emitter.removeListener('did-accept', fnc))
  }

  onDidChange (fnc) {
    this.emitter.on('did-change', fnc)
    return new Disposable(() => this.emitter.removeListener('did-change', fnc))
  }

  onKeyDown (fnc) {
    let cbk = event => {
      let returnValue = fnc(event, this.editor)
      if (returnValue === false) {
        event.stopImmediatePropagation()
        return false
      }
    }

    this.emitter.on('did-press-key', cbk)
    return new Disposable(() => this.emitter.removeListener('did-press-key', cbk))
  }

  onNavigate (fnc) {
    this.emitter.on('navigate', fnc)
    return new Disposable(() => this.emitter.removeListener('navigate', fnc))
  }

  update (content) {
    this.text = content
    this.focus()
    this.editor.selectAll()
  }

  submit (...args) {
    this.emitter.emit('did-accept', {
      payload: args,
      value: this.text
    })
  }

  focus () {
    this._elem.focus()
  }

  render () {

    const toolbar = [
      {
        text: '<',
        action: () => this.emitter.emit('navigate', -1)
      },
      {
        text: '>',
        action: () => this.emitter.emit('navigate', 1)
      },
      {
        text: 'Close',
        style: 'error',
        action: () => this.panel.destroy()
      }
    ]

    return (
      <section className='clearfix'>

        <h3>Assign</h3>

        <ul className='info-messages block padded'>
          <li>Assign values to the template variables</li>
        </ul>

        <article className='block padded'>
          <atom-text-editor mini ref={this.setEditorReference} />
        </article>

        <Toolbar buttons={toolbar} />

      </section>
    )
  }

  setEditorReference(ref) {
    // Bind keyboard events
    // HOW THE F*CK IS IT EVEN POSSIBRU THAT SUCH a SIMPLE F*CKING
    // FEAT AS LINEBREAK RECOGNIZION HAS - IN ALL ITS SUPER SIMPLE
    // SIMPLICITY - NOT MADE IT TO THE ATOM'S TextEditor ??!!?!?!??!?!!
    //
    // J.K.️(rolling:v) 🏳 Atom's hands down the greatest thing that's
    // happened since Git's coming <3 ty for all the hard work (or
    // how hard your job is anyways), GitHub's Atom white-collar guys :v

    // const handleKeydownEvent = event => { this.emitter.emit('did-press-key', event) }
    // const removeKeydownListener = () => ref.removeEventListener('keydown', handleKeydownEvent)
    //
    // ref.addEventListener('keydown', handleKeydownEvent)
    // this.subscriptions.add(new Disposable(removeKeydownListener))
    // Cache the editor model instance

    if (!ref || this._editor)
      return

    this._elem   = ref
    this._editor = ref.getModel()

    const didChange = this._editor.onDidStopChanging(event => this.emitter.emit('did-change', event))
    const removeField = new Disposable(() => this._editor.destroy())

    this.subscriptions.add(bindDisposableEvent('keydown', bindControlKeys.bind(this), ref))
    this.subscriptions.add(bindDisposableEvent('keydown', event => this.emitter.emit('did-press-key', event)))
    this.subscriptions.add(removeField)
    this.subscriptions.add(didChange)
  }

  set editor (dille) { throw new Error(ERROR.OVERRIDING_EDITOR) }
  get editor () { return this._editor }

}
