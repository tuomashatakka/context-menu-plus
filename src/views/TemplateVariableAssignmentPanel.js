'use babel'

import React, { Component } from 'react'
import { render } from 'react-dom'
import Emitter from 'events'
import { CompositeDisposable, Disposable } from 'atom'
import { ERROR } from '../constants'


class BasePanelComponent extends Component {

  static location = 'top'
  static priority = 10000
  static className = 'placeholder-variables tool-panel file-templates-panel padded'

  static create (props={}) {

    const panel = atom.workspace.addPanel(
      this.location,
      { className:  this.className,
        priority:   this.priority,
        item:       document.createElement('i'), // Just a placeholder
      }
    )
    let ComponentClass = this
    let instance       = <ComponentClass {...props} panel={panel}  />
    let component      = render(instance, panel.getElement())
    component.panel    = panel

    return component
  }

  constructor (props) {
    super(props)
    this.emitter        = new Emitter()
    this.subscriptions  = new CompositeDisposable()

    // Bind self to the instance methods
    this.registerEvents()
    this.destroy        = this.destroy.bind(this)
    this.onDidDestroy   = this.onDidDestroy.bind(this)
  }

  get panel () {
    return this.props.panel
  }

  registerEvents () {
    this.subscriptions.add(new Disposable(this.emitter.removeAllListeners))
    this.subscriptions.add(this.panel.onDidDestroy(event => this.emitter.emit('did-destroy', event)))
  }

  onDidDestroy (fnc) {
    this.emitter.on('did-destroy', event => fnc(event, this, this.panel))
  }

  destroy () {
    this.panel.destroy()
    this.subscriptions.dispose()
  }

  render () {
    throw new Error(`Classes extending ${this.name} should implement
      a render method that will return valid JSX. Please see React's
      manual for additional information.`)
    return <div></div>
  }

}
/**
 * @class
 * @extends React.Component
 */
export default class TemplateVariableAssignmentPanel extends BasePanelComponent {

  constructor (props) {

    super(props)
    this.state = {
      text: '',
    }
    this.destroy        = this.destroy.bind(this)
  }

  /**
   * Sets the text content for the input field
   * @method text (setter)
   * @param {string} [text=''] The new content for the input field. Defaults to empty string
   */

  set text (text='') {
    this.setState({ text })
    this.editor.setText(text)
  }

  /**
   * Gets and returns the text for the input field's text buffer
   * @method text (getter)
   * @return {string} Content for the input field
   */

  get text () {

    let editorContent = this.editor.getText()
    let { text } = this.state

    if (editorContent !== text)
      this.text = editorContent
    return editorContent
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

    const handleKeydownEvent = event => { this.emitter.emit('did-press-key', event) }
    const removeKeydownListener = () => ref.removeEventListener('keydown', handleKeydownEvent)

    ref.addEventListener('keydown', handleKeydownEvent)
    this.subscriptions.add(new Disposable(removeKeydownListener))

    // Cache the editor model instance
    this._editor = ref.getModel()
    this.subscriptions.add(new Disposable(this._editor.destroy))

    // Start listening for changes in editor's content
    let s = this._editor.onDidStopChanging(event => this.emitter.emit('did-change', event))
    console.warn("IS THIS DISPOSABLE", typeof s == Disposable, s)

    // Finally, replace the reference to this function with an empty function
    // to lower the overhead that React's constant calls to the reference function would
    // possibly cause (did not test how much it actually weighs ;))
    this.setEditorReference = () => {}
  }

  __makeEditorReferrable = (reference) => new Promise(bind =>
    (!this._editor && reference) && bind(this.setEditorReference(reference)))

  set editor (dille) { throw new Error(ERROR.OVERRIDING_EDITOR)}

  get editor () {
    return this._editor
  }

  componentDidMount () {
    console.info("COMPONENT DID MOUNT YIPPEEEE!", "\nthis,", this, "\narguments,", ...arguments)

    this.onDidChange(() => {
      let text = this.editor.getText()
      this.setState({ text })
      console.info("Changed text; new text =", text)
    })

  }

  onDidChange (fnc) { this.emitter.on('did-change', event => fnc(event, this.editor)) }
  onKeyDown (fnc) { this.emitter.on('did-press-key', event => fnc(event, this.editor)) }

  get field () {
    return <atom-text-editor mini
      ref={(ed) => this.__makeEditorReferrable(ed)} />
  }

  render () {
    return (
      <section>

        <h3>Assign template variables</h3>
        {this.field}

        <div className='btn-toolbar'>
          <button
            className='btn btn-error'
            onClick={() => this.panel.destroy()}>
            Close
          </button>

        </div>

      </section>
    )
  }
}
