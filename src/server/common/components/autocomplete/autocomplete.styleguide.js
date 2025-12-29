export const autocompleteStyleguide = {
  name: 'autocomplete',
  title: 'Autocomplete',
  description:
    'Enhanced select/search input with suggestions and async loading',
  category: 'form',
  macro: {
    path: 'autocomplete/macro.njk',
    name: 'appAutocomplete'
  },
  params: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique identifier'
    },
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Form field name'
    },
    {
      name: 'label.text',
      type: 'string',
      required: true,
      description: 'Label text'
    },
    {
      name: 'label.classes',
      type: 'string',
      required: false,
      description: 'Label CSS classes'
    },
    {
      name: 'hint.text',
      type: 'string',
      required: false,
      description: 'Hint text'
    },
    {
      name: 'hint.html',
      type: 'string',
      required: false,
      description: 'Hint HTML'
    },
    {
      name: 'errorMessage.text',
      type: 'string',
      required: false,
      description: 'Error message text'
    },
    {
      name: 'suggestions',
      type: 'array',
      required: false,
      description: 'Static suggestions array with text, value, hint'
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Pre-selected value'
    },
    {
      name: 'template',
      type: 'string',
      required: false,
      description: 'Template type: "search" for text input style'
    },
    {
      name: 'dataFetcher.name',
      type: 'string',
      required: false,
      description: 'Data fetcher name for async suggestions'
    },
    {
      name: 'loader.name',
      type: 'string',
      required: false,
      description: 'Loader identifier for loading state'
    }
  ],
  examples: [
    {
      title: 'Static suggestions',
      params: {
        id: 'example-autocomplete',
        name: 'service',
        label: { text: 'Select a service' },
        suggestions: [
          { text: 'Choose a service', value: '' },
          { text: 'cdp-portal-frontend', value: 'cdp-portal-frontend' },
          { text: 'cdp-user-service', value: 'cdp-user-service' }
        ]
      }
    }
  ]
}
