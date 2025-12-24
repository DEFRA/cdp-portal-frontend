# Loader

## CSS Classes

| Class                    | Description          |
| ------------------------ | -------------------- |
| `app-loader--small`      | Smaller spinner size |
| `app-loader--is-loading` | Show the loader      |

## JavaScript Control

When a `name` is provided, the loader can be controlled via JavaScript:

```javascript
// Show loader
const loader = document.querySelector('[data-js="deploy-loader"]')
loader.classList.add('app-loader--is-loading')

// Hide loader
loader.classList.remove('app-loader--is-loading')
```

## Notes

- The loader is hidden by default
- Add `app-loader--is-loading` class to show the spinner
- Often used with the `appButton` component for async operations
