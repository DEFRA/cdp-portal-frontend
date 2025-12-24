export const warningStyleguide = {
  name: 'warning',
  title: 'Warning',
  description: 'Warning message panel with icon',
  category: 'display',
  macro: {
    path: 'warning/macro.njk',
    name: 'appWarning'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Warning message text'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'Warning message HTML'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    },
    {
      name: 'isInverse',
      type: 'boolean',
      required: false,
      description: 'Use inverse (dark) styling'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Basic warning',
      params: {
        text: 'This service will be unavailable during deployment.'
      }
    },
    {
      title: 'Inverse warning',
      params: {
        text: 'Critical: Service health check failed',
        isInverse: true
      }
    }
  ]
}
