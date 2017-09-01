'use babel'

import React, { Component } from 'react'
import Emitter from 'events'
import prop from 'prop-types'
import self from 'autobind-decorator'

import Toolbar from './Toolbar'
import DirectoryView from './Directory'
import ErrorsList from '../components/ErrorsList'
import Breadcrumbs from '../components/Breadcrumbs'

import Directory from '../models/Directory'


export default class Browse extends Component {

  static propTypes = {
    currentDirectory: prop.oneOfType(Directory).isRequired,
  }

  constructor (props) {
    super(props)
    this.emitter = new Emitter()
    this.state = {
      options: {},
      selected: [],
      errors: [],
    }
  }

  @self
  updateViewOpitions (opts) {
    let options = Object.assign({}, this.state.options || {}, opts)
    this.setState({ options })
  }

  @self
  openPath (path) {
    this.props.currentDirectory.path = path
    this.setState({ selected: [] })
  }

  @self
  selectItem (item=null, opts={}) {
    let selected = []
    if (opts.inclusive && this.state.selected)
      selected.push(...this.state.selected)
    if (item)
      selected.push(item)
    this.setState({ selected })
  }

  @self
  isItemSelected (item) {
    let selected = this.state.selected || []
    return selected.includes(item)
  }

  @self
  submitEmpty () {
    this.emitter.emit('did-clear')
    this.close()
  }

  @self
  submitSelected () {
    this.emitter.emit('did-submit', this.state.selected)
    this.close()
  }

  @self
  cancel () {
    this.emitter.emit('did-cancel')
    this.close()
  }

  @self
  close () {
    this.emitter.emit('did-close')
  }

  render () {
    const CloseButton = () =>
      this.renderCloseButton()

    return (
      <section className="file-explorer">

        <CloseButton />

        <ErrorsList
          errors={this.state.errors} />

        <Breadcrumbs
          path={this.props.currentDirectory.path}
          onClick={this.openPath} />

        <Toolbar
          setOptions={this.updateViewOpitions} />

        <div className='directory-content'>

          <DirectoryView
            path={this.props.currentDirectory.path}
            files={this.props.currentDirectory.files}
            directories={this.props.currentDirectory.directories}
            isSelected={this.isItemSelected}
            onSelect={this.selectItem}
            openPath={this.openPath}
            options={this.state.options}
          />
        </div>

        <section className='btn-toolbar bottom-toolbar'>
          <div className='btn-group align-left'>
            <button
              onClick={this.cancel}
              className='btn'>
              <span className='icon icon-close' />
              Close</button>
            <button
              onClick={this.submitEmpty}
              className='btn btn-error'>
              <span className='icon icon-trashcan' />
              Clear</button>
          </div>

          <div className='btn-group align-right'>
            <button
              key='submit'
              onClick={this.submitSelected}
              className='btn'>
              <span className='icon icon-check' />
              Open</button>
          </div>
        </section>
      </section>
    )
  }

  renderCloseButton () {
    return (
      <a
        className='close-icon icon icon-x'
        onClick={() => this.close()}
      />
    )
  }

  onDidSubmit = (callback) => this.emitter.on('did-submit', callback)
  onDidCancel = (callback) => this.emitter.on('did-cancel', callback)
  onDidClear  = (callback) => this.emitter.on('did-clear',  callback)

}
