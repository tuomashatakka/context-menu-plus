'use babel'

import { CompositeDisposable } from 'atom'
import Dialog from './views/NewFileDialog'
import SettingsPanel from './views/SettingsTemplatePanel'
import { templateManager } from './templates';

let modals = {}
let commands = {}
let observedCommands = []
let observedCommandsSubscription = null

const observeCommand = (namespace, callback) => {
  observedCommands.push(namespace)
  commands[namespace] = callback
  if (observedCommandsSubscription &&
      !observedCommandsSubscription.diposed)
    observedCommandsSubscription.dispose()
  observedCommandsSubscription = atom.commands.onWillDispatch(
    event => (-1 === observedCommands.indexOf(event.type)) ? null : callback(event))
}

const getSelection = () => {
  let { mainModule } = atom.packages.getLoadedPackage('tree-view') || {}
  return (mainModule && mainModule.treeView)
    ? mainModule.treeView.selectedPath
    : active.uri
}

const openModal = ({ name, value }) => {

  if (!modals[name])
    modals[name] = new Dialog(name)

  setTimeout(() =>
    modals[name].input.element.focus(), 200)

  let onModalBlur = ({ clientX: x, clientY: y }) => {
    // Assert click is inside boundaries
    let { left, top, width, height } = modals[name].panel.getElement().getBoundingClientRect()
    if (x < left + width &&
        x > left &&
        y < top + height &&
        y > top)
      return

    // If the click is outside dialog, hide it
    modals[name].hide()
    document.removeEventListener('click', onModalBlur)
  }

  document.addEventListener('click', onModalBlur)

  modals[name].value = value
  modals[name].show()

  return modals[name]
}

// const onFileSave = (e) => {
//   let uri = atom.workspace.getActivePaneItem().getURI()
// }

const onWillAddNewFile = (e) => {
  let name  = 'new-file'
  let value = getSelection()

  openModal({ name, value })
  e.preventDefault()
  e.stopPropagation()
}

const onWillAddNewTemplateFile = () => openModal({
  name: 'new-template-file',
  value: templateManager().path,
})

let active = {
  uri:   null,
  title: null,
}

export default {

  subscriptions: null,

  activate(/*state={}*/) {

    atom.notifications.addSuccess('file-templates')

    const onChangeTab = atom.workspace.observeTextEditors((item) => {
      if (item.isEmpty && !item.isEmpty())
        active = {
          uri: item.getURI ? item.getURI() : null,
          title: item.getTitle(),
          el: item.element,
          save: p => item.saveAs(p),
        }
      else
        return false

    })

    const changeTabSubscription = atom.workspace.observePaneItems(item => {
      if (item.constructor.name !== 'SettingsView')
        return
      let name = 'File Templates'
      let icon = 'file-directory'
      let panel = SettingsPanel.create({
        name,
        icon,
        toolbar: [
          {
            text:   'Add Template',
            icon:   'plus',
            style:  'info',
            action: () => onWillAddNewTemplateFile(),
          }
        ],
      })
      // element.innerHTML = '<h3>' + title + '</h3>'
      item.addCorePanel(panel.name, panel.icon, () => panel)
    })


    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(onChangeTab)
    this.subscriptions.add(changeTabSubscription)

    observeCommand('application:new-file', onWillAddNewFile)
    // this.subscriptions.add(onAddTab)
    // observeCommand('core:save', onFileSave)
    // const onAddTab = atom.workspace.onDidAddTextEditor(({ item }) => {
    //     pending = item
    //     if (item.isEmpty && item.isEmpty() && item.getURI && !item.getURI())
    //       return false
    // })
  },

  deactivate() {
    this.subscriptions.dispose()
    if (observedCommandsSubscription &&
        !observedCommandsSubscription.diposed)
      observedCommandsSubscription.dispose()
  }

}


// function registerOpener (viewClass) {
//
//   let op = function(uri) {
//     if (false)
//       return new viewClass(uri)
//   }
//
//   return atom.workspace.addOpener(op)
// }
//
//
// /**
//  * Registers a new view provider to the global view registry. Also assigns
//  *
//  * @method registerViewProvider
//  *
//  * @param  {constructor}             model A class for the model that a view is registered for
//  * @param  {constructor}             view  Bound view's constructor
//  *
//  * @return {Disposable}             A disposable for the registered view provder
//  */
//
// function registerViewProvider (model, view) {
//
//   if (!(view.item &&
//         view.getItem ||
//        (view.prototype && view.prototype.getItem)))
//     throw new Error("The view " + view.name + " should implement a getItem method")
//
//   model.prototype.getElement = function () {
//     if (this.element)
//       return this.element
//   }
//
//   const provideView = (obj) => {
//     return new view()
//     // let v          = new view()
//     // v.model        = obj
//     // obj.view       = v
//     // return typeof v.getItem === 'function' ? v.getItem() : v.item
//   }
//
//   return atom.views.addViewProvider(model, provideView)
// }
