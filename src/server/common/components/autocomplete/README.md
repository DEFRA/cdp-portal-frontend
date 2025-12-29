# Autocomplete

## Async Data Loading

Use `dataFetcher` for server-side suggestions:

```nunjucks
{{ appAutocomplete({
  id: "version",
  name: "version",
  label: { text: "Select version" },
  dataFetcher: {
    name: "versions-fetcher"
  },
  loader: { name: "version-loader" }
}) }}
```

The endpoint should return:

```json
{
  "suggestions": [
    {
      "text": "1.0.0",
      "value": "1.0.0"
    },
    {
      "text": "0.9.0",
      "value": "0.9.0"
    }
  ]
}
```

## JavaScript API

The component initialises automatically. Access programmatically:

```javascript
const autocomplete = document.querySelector('[data-js="app-autocomplete"]')
// Trigger refresh of suggestions
autocomplete.dispatchEvent(new CustomEvent('refresh'))
```
