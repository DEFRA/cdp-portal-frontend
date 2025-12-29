# Client-side JavaScript

Browser JavaScript for progressive enhancement and interactivity.

- [File Structure](#file-structure)
- [Entry Point](#entry-point)
- [Component Pattern](#component-pattern)
- [XHR Helper](#xhr-helper)
- [Polling](#polling)
- [Events](#events)
- [Build Process](#build-process)

## File Structure

```
src/client/
├── javascripts/
│   └── application.js      # Main entry point
└── common/
    ├── helpers/            # Shared utilities
    │   ├── xhr.js          # AJAX helper
    │   ├── poll.js         # Polling utility
    │   └── event-emitter.js
    └── constants/
        └── event-name.js   # Custom events
```

Component JavaScript is co-located:

```
src/server/common/components/
└── autocomplete/
    ├── autocomplete.js     # Component JavaScript
    └── template.njk
```

## Entry Point

`src/client/javascripts/application.js` initialises all components:

```javascript
import { initAll } from 'govuk-frontend'
import { Autocomplete } from '../common/components/autocomplete/autocomplete.js'

// Initialise GOV.UK Frontend
initAll()

// Initialise custom components
const autocompletes = document.querySelectorAll('[data-js="app-autocomplete"]')
autocompletes.forEach((el) => new Autocomplete(el))
```

## Component Pattern

Components use data attributes for configuration:

```nunjucks
<div data-js="app-loader" data-loader-name="{{ params.name }}">
  <!-- content -->
</div>
```

```javascript
class Loader {
  constructor(element) {
    this.element = element
    this.name = element.dataset.loaderName
    this.init()
  }

  init() {
    // Setup event listeners
  }

  show() {
    this.element.classList.add('app-loader--visible')
  }

  hide() {
    this.element.classList.remove('app-loader--visible')
  }
}
```

## XHR Helper

Use the XHR helper for AJAX requests:

```javascript
import { xhrRequest } from '../common/helpers/xhr.js'

const response = await xhrRequest('/api/data', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' })
})
```

## Polling

For real-time updates:

```javascript
import { poll } from '../common/helpers/poll.js'

poll({
  url: '/api/status',
  interval: 5000,
  onSuccess: (data) => {
    updateUI(data)
  },
  shouldStop: (data) => data.status === 'complete'
})
```

## Events

Custom events for component communication:

```javascript
import { eventName } from '../common/constants/event-name.js'

// Emit event
document.dispatchEvent(new CustomEvent(eventName.refresh))

// Listen
document.addEventListener(eventName.refresh, handler)
```

## Build Process

Webpack bundles JavaScript with:

- ES module support
- Babel transpilation
- Production minification

Output: `public/javascripts/application.js`
