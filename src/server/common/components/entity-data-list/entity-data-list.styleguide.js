export const entityDataListStyleguide = {
  name: 'entity-data-list',
  title: 'Entity Data List',
  description:
    'Key-value definition list for entity attributes using appEntity',
  category: 'data',
  macro: {
    path: 'entity-data-list/macro.njk',
    name: 'appEntityDataList'
  },
  params: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      description: 'Optional section heading'
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Array of items with heading.text, heading.classes, and entity object'
    }
  ],
  examples: [
    {
      title: 'Basic data list',
      params: {
        heading: 'Service Details',
        items: [
          {
            heading: { text: 'Created' },
            entity: { kind: 'date', value: '2024-01-15T10:30:00Z' }
          },
          {
            heading: { text: 'Team' },
            entity: { kind: 'text', value: 'Platform' }
          },
          {
            heading: { text: 'Repository' },
            entity: {
              kind: 'link',
              value: 'DEFRA/cdp-portal-frontend',
              url: 'https://github.com/DEFRA/cdp-portal-frontend',
              newWindow: true
            }
          }
        ]
      }
    }
  ]
}
