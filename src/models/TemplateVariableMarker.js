'use babel'

import { TMPL_VAR_STATIC_NAME } from '../constants'


export default class TemplateVariableMarker {

  constructor ({ template, range, key, value='' }) {

    this.key      = key
    this.template = template
    this.editor   = template.editor

    // Bind member methods to retain `this`
    this.get = this.get.bind(this)
    this.mark = this.mark.bind(this)
    this.clear = this.clear.bind(this)
    this.update = this.update.bind(this)
    this.isValid = this.isValid.bind(this)
    this.decorate = this.decorate.bind(this)
    this.setRange = this.setRange.bind(this)
    this.invalidate = this.invalidate.bind(this)
    this.resolveValue = this.resolveValue.bind(this)
    this.updateEndpoint = this.updateEndpoint.bind(this)
    this.__defineGetter__ = this.__defineGetter__.bind(this)

    // Create the marker instance and set its text content
    this.mark(range)
    this.update(value)
  }


  // Section - Core

  /**
   * Return the DisplayMarker correspondent
   * to the caller instance. If a marker does not
   * exist, a new marker is created.
   *
   * @method get
   * @return {DisplayMarker} [description]
   */
  get = () =>
    this.marker || this.mark()

  /**
   * Transpose the endpoint of the marker's range
   * by the amount described by the `diff` parameter
   * @method updateEndpoint
   * @param  {number} diff Amount of columns the endpoint is shifted
   */
  updateEndpoint (diff) {
    this.range = this.range.translate([0, 0], [0, diff])
  }

  /**
   * Insert a template variable highlight marker
   * into the given position
   * @method mark
   * @param  {Range} range Range for the inserted marker
   * @return {Marker}      The inserted marker
   */
  mark (range) {

    let rn = range || this.range
    let dt = {
      invalidate: 'never',
      maintainHistory: true }

    if (this.marker)
      this.clear()

    this.marker = this.editor.markBufferRange(rn, dt)
    this.decorate()
    return this.marker
  }


  // Section - Marker validation

  /**
   * Get the validity of the marker
   * @method isValid
   * @return {Boolean}  `true` if the marker is valid, `false` otherwise
   */
  isValid () { return this.marker ? this.marker.isValid() : false }

  /**
   *
   * Set the validity state for the marker
   * @method valid
   * @param  {Bool} [state=true] The new validity state for the marker
   */
  set valid (state=true) {
    this.marker.valid = state !== false ? true : false }

  /**
   * Get the validity for the marker
   * @method valid
   * @return {Bool} Validity of the marker; false if no marker exists
   */
  get valid () {
    return this.isValid() }

  /**
   * Invalidate the marker;
   * a marker that has been invalidated will not be displayed
   * unless it has been marked valid again
   * @method invalidate
   * @return {boolean}  Truth value describing wheter the marker
   *                    was valid before the invalidation
   */
  invalidate () {
    this.decorate({ class: 'assigned' })
    let state = this.isValid()
    this.valid = false
    return state
  }


  // Section - Text content

  /**
  * Get the text that is contained within the marker's range
  * @method content
  * @return {string} Text between the start and
  *                  end points of the marker's range
  */
  get content () {
   return this.editor.buffer.getTextInRange(this.range)
  }

  /**
   * Get the predefined value for the variable
   *
   * @method resolveValue
   * @return {string}  The first value amongst the list of values provided
   *                   by the file template variable providers.
   *
   *                   A `null` value is provided as a return value
   *                   if no values could be resolved by any of the
   *                   providers.
   */
  resolveValue = () => {
    let resolution = this.template.getConstantValue(this.key)
    let value = resolution.length ? resolution[0] : null
    this.update(value)
    return value
  }

  /**
   * Update the text content for the marker.
   * If a marker does not yet exist, creates it first.
   *
   * @method update
   * @param  {string} [text=''] The new content for the template variable highlight marker
   */
  update (text='') {

    // let text = this.editor.buffer.getTextInRange(this.range)
    if (!this.isValid())
      this.mark()
    this.editor.buffer.setTextInRange(this.range, text)

    let diff = text.length - this.currentLength
    this.updateEndpoint(diff)
  }

  /**
   * Destroy the marker and the decoration related to it
   * @method clear
   */
  clear () {
    if (this.marker)
      this.marker.destroy()
    if (this.decor)
      this.decor.destroy()
  }

  /**
   * Add a DecorationMarker for the DisplayMarker
   * and update it with the given properties
   * @method decorate
   * @param state     `false` for an unassigned variable,
   *                   `true` for assigned.
   * @param className  A list of class names that are added for
   *                   the decoration marker. May be an array or
   *                   a string with classes separated by whitespace.
   * @return {DecorationMarker}   The decoration that was added
   */
  decorate (opts={}) {

    let defaults = {
      state: 'unassigned',
      className: [] }
    opts = { ...defaults, ...opts }

    let { state, className } = opts
    if (typeof className === 'string')
      className = className.split(/\b/g)

    let properties = {
      type: 'highlight',
      kind: TMPL_VAR_STATIC_NAME,
      class: [TMPL_VAR_STATIC_NAME, ...className, state ].join(' ')
    }

    if (this.decor)
      this.decor.destroy()

    return (this.decor = this.editor.decorateMarker(this.marker, properties))
  }

  /**
   * Update the range for the TextEditor pane item's marker
   * @method setRange
   * @param  {Range} rn The new range
   */
  setRange (rn) {
    this.marker.setBufferRange(rn)
  }

  /**
   * Get the current position of the marker
   * @method range
   * @return {Range} Marker's highlight range
   */
  get range () {
    return this.marker ? this.marker.getBufferRange() : [[0,0], [0,0]] }

  /**
   * Get the marker's highlighted area's current length
   * @method currentLength
   * @return {number}  An integer describing the length of the highlighted area
   */
  get currentLength () {
    return this.range ? this.range.getExtent().column : 0
  }

}
