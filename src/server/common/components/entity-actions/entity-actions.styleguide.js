export const entityActionsStyleguide = {
  name: 'entity-actions',
  title: 'Entity Actions',
  description: 'Form container for search and filter controls with auto-submit',
  category: 'data',
  macro: {
    path: 'entity-actions/macro.njk',
    name: 'appEntityActions'
  },
  params: [
    {
      name: 'formAction',
      type: 'string',
      required: true,
      description: 'Form action URL'
    },
    {
      name: 'legend.text',
      type: 'string',
      required: false,
      description: 'Optional legend/heading text'
    },
    {
      name: 'search',
      type: 'string',
      required: false,
      description: 'Rendered search component HTML'
    },
    {
      name: 'filters',
      type: 'array',
      required: false,
      description: 'Array of rendered filter component HTML'
    }
  ],
  examples: [
    {
      title: 'Entity actions with legend',
      params: {
        formAction: '/services',
        legend: { text: 'Services' }
      }
    }
  ]
}
