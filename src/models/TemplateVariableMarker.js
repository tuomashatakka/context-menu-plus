'use babel'


export default class TemplateVariableMarker {

  constructor (template, range) {
    this.template = template
    this.editor   = template.editor
    this.mark()
    this.setRange(range)

    this.__defineGetter__ = this.__defineGetter__.bind(this)
    this.updateEndpoint = this.updateEndpoint.bind(this)
    this.invalidate = this.invalidate.bind(this)
    this.setRange = this.setRange.bind(this)
    this.decorate = this.decorate.bind(this)
    this.isValid = this.isValid.bind(this)
    this.update = this.update.bind(this)
    this.clear = this.clear.bind(this)
    this.mark = this.mark.bind(this)
    this.get = this.get.bind(this)
  }

  mark () {
    let rn = (arguments.length ? arguments[0] : this.range)
    let dt = {
      invalidate: 'never',
      maintainHistory: false }
    if (this.marker)
      this.clear()
    this.marker = this.editor.markBufferRange(rn, dt)
    this.decorate()
  }

  clear () {
    if (this.marker)
      this.marker.destroy()
    if (this.decor)
      this.decor.destroy()
  }

  invalidate () {
    this.decorate({ class: 'assigned' })
    let state = this.isValid()
    this.valid = false
    return state
  }

  isValid () {
    return this.marker.isValid()
  }

  setRange (rn) {
    this.marker.setBufferRange(rn)
  }

  updateEndpoint (diff) {
    this.range = this.range.translate([0, 0], [0, diff])
  }

  update (text) {
    // let text = this.editor.buffer.getTextInRange(this.range)
    if (this.isValid()) {
      let diff = text.length - this.currentLength
      this.editor.buffer.setTextInRange(this.range, text)
      this.updateEndpoint(diff)
    }
  }

  decorate (props) {
    props = {
      type: 'highlight',
      class: 'template-variable unassigned',
      ...props }

    if (this.decor)
      this.decor.destroy()
    this.decor = this.editor.decorateMarker(this.marker, props)
  }

  set valid (state) {
    this.marker.valid = state !== false ? true : false
  }

  get valid () {
    return this.marker ? this.marker.valid || false : false
  }

  get range () {
    console.info("getrange", this, this.marker)
    return this.marker ? this.marker.getBufferRange() : ''
  }

  get currentLength () {
    return this.range.getExtent().column
  }

  get content () {
    return this.editor.buffer.getTextInRange(this.range)
  }

  get () {            return this.marker }
  static get (inst) { return inst.marker }

}
