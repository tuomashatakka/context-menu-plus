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

To provide a custom context menu view fragment for a package, the package must ... TODO

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
      <td>Provider.addFragment (item: Element |string, priority: number?)</td>
      <td>Add a section to the context menu</td>
      <td>
        <dl>
          <dd>item (required)</dd>
          <dt>A view for the fragment, or a string containing HTML content for the fragment</dt>

          <dd>priority (optional)</dd>
          <dt>
            The ordering of context menu's fragments is resolved by fragments' priority. Items
            with the highest priority are kept topmost
          </dt>
        </dl>
      </td>

    </tr>

    <tr>
      <td>Provider.removeFragment (itemOrKey: Element | number)</td>
      <td>Remove a section from the context menu</td>
      <td>

        <dl>
          <dd>itemOrKey (required)</dd>
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
      <td>hideMenuItems (...items: Array<Object>)</td>
      <td>Hide the given menu items from the context menu</td>
      <td>A list of menu items to be removed from the menu</td>
    </tr>

    <tr>
      <td>showMenuItems (...items: Array<Object>)</td>
      <td>Show the given menu items from the context menu</td>
      <td>A list of menu items to be added to the menu</td>
    </tr>

  </tbody>
</table>
