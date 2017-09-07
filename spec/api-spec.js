/* globals jasmine, describe, beforeEach, waitsForPromise, expect, it */


describe ("Context menu plus' service provider", function () {
  let workspace
  let service
  let menu

  const q = qu => workspace.querySelector(qu)

  beforeEach(function () {
    workspace = atom.views.getView(atom.workspace)
    return waitsForPromise(async function () {
      const pack = await atom.packages.activatePackage('context-menu-infinite')
      service    = pack.mainModule.provideContextMenu()
      menu       = pack.mainModule.menu
    })
  })

  it("is available", function () {
    expect(service).toBeDefined()

    const desc = Object.getOwnPropertyNames(service)
    expect(desc.indexOf('addFragment')).not.toBe(-1)
    expect(desc.indexOf('removeFragment')).not.toBe(-1)
    expect(desc.indexOf('clearFragments')).not.toBe(-1)

    expect(() => service.addFragment()).toThrow('Item is not defined')
    expect(menu.fragments.count()).toBe(2)
  })

  it("is able to add a fragment", function () {
    expect(menu).toBeDefined()
    expect(menu.fragments.count()).toBe(2)

    let fr = service.addFragment('ok')
    expect(menu.fragments.count()).toBe(3)
    expect(fr.constructor.name).toBe('ContextMenuFragment')
  })

  it("displays the added fragments in the document", function () {
    jasmine.attachToDOM(workspace)

    console.log(atom.views.getView(menu))
    console.log(q('atom-context-menu'))
    console.log(workspace.parentElement, workspace)
    console.log(service, menu)
  })
})
