'use babel'


const META = {
  spacing: { unit: 'em' }
}


export function observe (...key) {
  let { name } = require('../package.json')
  let handler = key.pop()
  return atom.config.observe(
    [ name, ...key ].join('.'), handler)
}

export function update(attrs={}) {
  console.warn('Updating config', attrs)
  let el = document.body

  for (let [k,v] of Object.entries(attrs)) {

    let key   = '--' + k
    let unit  = META[k] ? META[k].unit : ''
    let value = v.toString() + unit

    el.style.setProperty(key, value)
  }
}

export default module.exports
