export const detailedListStyleguide = {
  name: 'detailed-list',
  title: 'Detailed List',
  description: 'Two-column key-value list display with HTML content',
  category: 'data',
  macro: {
    path: 'detailed-list/macro.njk',
    name: 'appDetailedList'
  },
  params: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Array of items with title.html (primary) and info.html (secondary)'
    },
    {
      name: 'isInverse',
      type: 'boolean',
      required: false,
      description: 'Apply inverse (dark) styling'
    }
  ],
  examples: [
    {
      title: 'Basic detailed list',
      params: {
        items: [
          {
            title: { html: 'Repository' },
            info: { html: 'DEFRA/cdp-portal-frontend' }
          },
          { title: { html: 'Language' }, info: { html: 'JavaScript' } }
        ]
      }
    },
    {
      title: 'Inverse detailed list',
      params: {
        isInverse: true,
        items: [
          { title: { html: 'Environment' }, info: { html: 'Production' } },
          { title: { html: 'Status' }, info: { html: 'Running' } }
        ]
      }
    }
  ]
}
