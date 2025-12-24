export const bannerStyleguide = {
  name: 'banner',
  title: 'Banner',
  description: 'Alert notification banner with type-based styling',
  category: 'display',
  macro: {
    path: 'banner/macro.njk',
    name: 'appBanner'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Banner message text'
    },
    {
      name: 'type',
      type: 'string',
      required: false,
      description:
        'Banner type: success, warning, error (adds app-banner--{type} class)'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    },
    {
      name: 'js',
      type: 'string',
      required: false,
      description: 'JavaScript data attribute for client-side interaction'
    }
  ],
  examples: [
    {
      title: 'Success banner',
      params: {
        text: 'Service deployed successfully',
        type: 'success'
      }
    },
    {
      title: 'Info banner',
      params: {
        text: 'This action cannot be undone',
        type: 'info'
      }
    },
    {
      title: 'Error banner',
      params: {
        text: 'Deployment failed',
        type: 'error'
      }
    }
  ]
}
