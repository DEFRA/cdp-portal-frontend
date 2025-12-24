export const searchStyleguide = {
  name: 'search',
  title: 'Search',
  description: 'Search input with clear button',
  category: 'form',
  macro: {
    path: 'search/macro.njk',
    name: 'appSearch'
  },
  params: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Input element ID'
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
      name: 'value',
      type: 'string',
      required: false,
      description: 'Pre-filled search value'
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
      name: 'iconDescription',
      type: 'string',
      required: false,
      description: 'Accessible description for search icon'
    },
    {
      name: 'hasSearchResultError',
      type: 'boolean',
      required: false,
      description: 'Indicates search result error state'
    }
  ],
  examples: [
    {
      title: 'Basic search',
      params: {
        id: 'search',
        name: 'q',
        label: { text: 'Search services' }
      }
    },
    {
      title: 'Search with hint',
      params: {
        id: 'service-search',
        name: 'service',
        label: { text: 'Find a service' },
        hint: { text: 'Enter a service name or keyword' }
      }
    }
  ]
}
