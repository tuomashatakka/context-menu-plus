'use babel'

import React from 'react'
import prop from 'prop-types'
import ListView from '../components/List'


const DirectoryView = ({ directories, files, isSelected, onDirectorySelect, onFileSelect, options }) => {

  const emptyDir = !files.length && !directories.length ? '<empty>' : null
  directories.unshift('..')

  const directoriesView = <ListView
    isSelected={isSelected}
    onClick={onDirectorySelect}
    title='Directories'
    items={directories}
  />

  const filesView = <ListView
    isSelected={isSelected}
    onClick={onFileSelect}
    title='Files'
    items={files}
  />

  const style = {
    '--list-item-text-size': options.textSize
  }

  return <article
    style={style}
    className={'file-browser directory-view ' + options.itemsDisplay}>

    {directoriesView}
    {filesView}
    {emptyDir}

  </article>
}

DirectoryView.propTypes = {
  directories: prop.array.isRequired,
  isSelected: prop.func.isRequired,
  onFileSelect: prop.func.isRequired,
  onDirectorySelect: prop.func.isRequired,
  files: prop.array.isRequired,
  path: prop.string.isRequired,
  open: prop.func.isRequired,
  options: prop.object.isRequired,
}

export default DirectoryView
