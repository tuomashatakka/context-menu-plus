'use babel'

import fs from 'fs-plus'
import path from 'path'

class DefaultFileIcons {

  iconClassForPath (filePath) {

    let extension = path.extname(filePath)

    if (fs.isSymbolicLinkSync(filePath))
      return 'icon-file-symlink-file'

    else if (fs.isReadmePath(filePath))
      return 'icon-book'

    else if (fs.isCompressedExtension(extension))
      return 'icon-file-zip'

    else if (fs.isImageExtension(extension))
      return 'icon-file-media'

    else if (fs.isPdfExtension(extension))
      return 'icon-file-pdf'

    else if (fs.isBinaryExtension(extension))
      return 'icon-file-binary'

    else
      return 'icon-file-text'
  }

}

class FileIcons {

  constructor () {
    this.service = new DefaultFileIcons()
  }

  resetService = () =>
    this.service = new DefaultFileIcons()

  getService = () =>
    this.service

  setService = (service) =>
    this.service = service

}

let _iconservice = new FileIcons()

export default _iconservice
