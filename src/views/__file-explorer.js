'use babel'

import autobind from 'autobind-decorator'
import React, { Component } from 'react'
import css, { modalCss } from '../style'
import { render } from 'react-dom'

const SINGLE_CLICK = 1
const REQUIRE_SUBMIT = 2
const REQUIRE_SUBMIT_LIMIT_SINGLE = 4

export const MODE = {
  SINGLE_CLICK,
  REQUIRE_SUBMIT,
  REQUIRE_SUBMIT_LIMIT_SINGLE,
}


export default class FileExplorerView extends Component {

  constructor (props) {

    super(props)
    this.__defineGetter__('model', () => props.model)
    this.__defineGetter__('view',  () => props.view)

    let except = error => {
      console.log(error, model) // FIXME: Remove

      this.update({
        errors: [ error ? error.toString() : '' ] })
    }

    console.log(props) // FIXME: Remove

    let { directories, files, path } = props.model
    this.state = {
      directories,
      files,
      path,
      errors: [],
      view: {
        type: 'list',
      },
      selectionMode: MODE.SINGLE_CLICK,
    }

    // let pathChangedHandler = (path) => {
    //   console.log(path, this)
    //   this.update({
    //     path,
    //     errors: [],
    //     directories: props.model.directories,
    //     files: props.model.files,
    //   })
    // }

    // model.onException(except)
    // props.model.onPathChanged(pathChangedHandler)
    // props.model.onDeselect(pathChangedHandler)
    // props.model.onSelect(pathChangedHandler)
  }

  @autobind
  setSelectionMode (selectionMode=null) {
    this.setState({ selectionMode })
  }

  @autobind
  update (props) {
    this.setState(props)
  }

  @autobind
  hide () {
    console.log(this)
    this.element.hide()
  }

  @autobind
  show () {
    this.element.show()
  }

  render () {
    let View = this.view

    let { path, directories, files, errors, view, selectionMode } = this.state

    let directoryView = { ...view, setOptions: (opts) => this.update({ view: { ...view, ...opts } }) }
    let singleMode    = selectionMode !== MODE.SINGLE_CLICK
    let isSelected    = uri => this.model.selection.contains(uri)
    return <View
      view={directoryView}
      showSubmitButton={singleMode}
      directories={directories}
      errors={errors}
      files={files}
      path={path}
      open={this.model.dispatch}
      close={this.hide}
      submit={this.model.submit}
      isSelected={isSelected}
    />
  }

}

const root = () => {
  let item = document.createElement('div')
  let panel = atom.workspace.addModalPanel({ item })
  let element = atom.views.getView(panel)
  item.setAttribute('style', ` max-height: 100%; overflow: auto; `)
  element.setAttribute('style', modalCss)
  element.show = () => panel.show()
  element.hide = () => panel.hide()
  return element
}

let component

export const renderFileExplorer = (props) => {
  if (!component) {
    let element = root()
    component = render(<FileExplorerView {...props} />, element)
    component.__defineGetter__('element', () => element)
    atom.styles.addStyleSheet(css)
  }
  return component
}
