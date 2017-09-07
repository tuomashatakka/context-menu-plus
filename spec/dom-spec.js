/* globals jasmine, describe, beforeEach, waitsForPromise, expect, it */


describe ("Context menu element", function () {
  let workspace
  let service
  let menu

  const q = qu => workspace.querySelector(qu)

  beforeEach(function () {
    workspace = atom.views.getView(atom.workspace)
    return waitsForPromise(async function () {
      const pack = await atom.packages.activatePackage('context-menu-infinite')
      menu       = pack.mainModule.menu
    })
  })

  it("is attached to the dom upon querying its view", function () {

    jasmine.attachToDOM(workspace)
    expect(q('atom-context-menu')).not.toExist()

    let view = atom.views.getView(menu)
    expect(q('atom-context-menu')).toExist()
    expect(q('atom-context-menu')).toBe(view)
  })

  it("contains initial fragments", function () {
    jasmine.attachToDOM(workspace)
    menu.enable()

    let view = atom.views.getView(menu)
    let children = view.querySelectorAll('context-fragment')

    expect(children.length).not.toEqual(0)
  })
})
