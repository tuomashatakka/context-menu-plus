# Context Menu Plus

#### Modifiable context-menu for atom

## Highlights

  - Fully customizable with CSS
  - Service for adding custom views/widgets/applets to the context menu
  -


## Custom views

### init.js

TODO

### Service API

To provide a custom context menu view fragment for a package, the package must consume the ContextMenuService service.

To consume the service, add a consumedServices section containing the context-menu entry to your package's ``package.json`` file:

```json

"consumedServices": {
  "context-menu": {
    "versions": {
      "1.0.0": "consumeContextMenu"
    }
  }
}
```

Additionally, the main module has to export a function that has the name one has defined in the ``package.json``'s consumedServices (in the snippet above it's called ``consumeContextMenu`` but you may call it whatever you want - just remember that the exported function must be named equally with the entry you have in the ``package.json``). So, for the above, the main module needs to have

```javascript
export function consumeContextMenu (menu) {

  // The `menu` now contains an interface for adding or
  // modifying fragments displayed in the contextual menu

  // To create a fragment, call the menu interface's
  // ``addFragment`` method:
  let fragment = menu.addFragment(item, data)

  // To display the created fragment, you must either pass
  // visible: true in the createFragment call's data parameter
  // or call the fragment's `show` method:
  fragment.show()
}
```

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
      <th>Arguments</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>addFragment(item, data)</td>
      <td>Add a section to the context menu</td>
      <td>
        <dl>
          <dt>item: <small>Element|string</span> (required)</dt>
          <dd>
            A view for the fragment, or a string containing HTML
            content for the fragment
          </dd>

          <dt>
            data?:
            <small>{ priority?: number, visible?: boolean } (optional)</small>
          </dt>
          <dd>
            The ordering of context menu's fragments is resolved
            by fragments' priority. Items with the highest priority
            are kept topmost
          </dd>

        </dl>
      </td>

    </tr>

    <tr>
      <td>removeFragment(itemOrKey)</td>
      <td>Remove a section from the context menu</td>
      <td>

        <dl>
          <dd>itemOrKey: Element | number (required)</dd>
          <dt>Identifier for the fragment that should be removed</dt>
        </dl>

      </td>

    </tr>

    <tr>
      <td>clearFragments</td>
      <td>clearFragments</td>
      <td>clearFragments</td>
    </tr>

    <tr>
      <td>hideMenuItems(...items)</td>
      <td>Hide the given menu items from the context menu</td>
      <td>items: Array<Object> A list of menu items to be removed from the menu</td>
    </tr>

    <tr>
      <td>showMenuItems(...items)</td>
      <td>Show the given menu items from the context menu</td>
      <td>items: Array<Object> A list of menu items to be added to the menu</td>
    </tr>

  </tbody>
</table>
