export const tagStyleguide = {
  name: 'tag',
  title: 'Tag',
  description:
    'Enhanced GOV.UK tag with optional loader and link functionality',
  category: 'display',
  macro: {
    path: 'tag/macro.njk',
    name: 'appTag'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Tag text content'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'Tag HTML content'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    },
    {
      name: 'url',
      type: 'string',
      required: false,
      description: 'Makes tag a link'
    },
    {
      name: 'newWindow',
      type: 'boolean',
      required: false,
      description: 'Open link in new window'
    },
    {
      name: 'isLoading',
      type: 'boolean',
      required: false,
      description: 'Shows loading spinner'
    },
    {
      name: 'loaderClasses',
      type: 'string',
      required: false,
      description: 'Additional classes for the loader'
    },
    {
      name: 'link.classes',
      type: 'string',
      required: false,
      description: 'Additional classes for the link wrapper'
    },
    {
      name: 'attributes',
      type: 'object',
      required: false,
      description: 'Additional HTML attributes'
    }
  ],
  examples: [
    {
      title: 'Basic tag',
      params: { text: 'Running' }
    },
    {
      title: 'Success tag',
      params: { text: 'Deployed', classes: 'govuk-tag--green' }
    },
    {
      title: 'Loading tag',
      params: {
        text: 'Deploying',
        isLoading: true,
        classes: 'app-tag--purple'
      }
    },
    {
      title: 'Tag as link',
      params: {
        text: 'View details',
        url: '/services/example',
        classes: 'govuk-tag--blue'
      }
    }
  ]
}
