# Button

## JavaScript Events

The loader is controlled via JavaScript events:

```javascript
import { eventName } from '../constants/event-name.js'

// Show loader
document.dispatchEvent(
  new CustomEvent(eventName.loaderShow, {
    detail: { name: 'deploy-loader' }
  })
)

// Hide loader
document.dispatchEvent(
  new CustomEvent(eventName.loaderHide, {
    detail: { name: 'deploy-loader' }
  })
)
```

## Sibling Buttons

When placing buttons next to each other:

```nunjucks
<div class="govuk-button-group">
  {{ appButton({
    text: "Deploy",
    loader: { name: "deploy", hasSiblingButton: true }
  }) }}
  {{ govukButton({
    text: "Cancel",
    classes: "govuk-button--secondary"
  }) }}
</div>
```

## Notes

- This component is specifically for buttons that need loader support
- For standard buttons without loaders, use `govukButton` directly
- The button always renders with `govuk-button app-button` classes
