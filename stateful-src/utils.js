'use babel'

import { extname } from 'path'

export async function getBase64FromImageUrl(url) {

  let ext = extname(url).substr(1)
  let img = new Image()
  let setExtension = (data) =>
    data.replace(/^(data:image\/)\w+(;base64,)/,
    (_, prefix, suffix) => prefix + ext + suffix)

  img.setAttribute('crossOrigin', 'anonymous')

  return await new Promise((resolve, reject) => {

    img.onerror = () =>
      reject(url)

    img.onabort = () =>
      reject(url)

    img.onload = function () {

      let canvas = document.createElement("canvas")
      canvas.width =this.width
      canvas.height =this.height

      let ctx = canvas.getContext("2d")
      ctx.drawImage(this, 0, 0);

      let dataURL = canvas.toDataURL("image/png")
      return resolve(setExtension(dataURL))
    }

    img.src = url
  })
}

export function prefix ({ keyPath=[], totalCharWidth=30 }) {
  let key = keyPath.join('-')
  let space = Array(totalCharWidth - key.length).join(' ')
  return `@${key}:${space}`
}

export function error (e, ...msg) {


  let { name } = require('../package.json')
  let title = `${name} Package Error`
  let description = msg.reduce((str, message) => str + `<p>${message}</p>`, `<h4>${e.message}</h4>`)
  let buttons = {
    'Open developer tools': () => atom.openDevTools() }

  if (atom.devMode)
    // eslint-disable-next-line
    console.warn(`${name}: ${e}`)

  atom.notifications.addError(title, {
    description,
    dismissable: true,
    buttons: Object.keys(buttons).map(text => ({ text, onDidClick: () => buttons[text]() }))
  })
}
