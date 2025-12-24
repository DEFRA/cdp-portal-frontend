export const infoStyleguide = {
  name: 'info',
  title: 'Info',
  description: 'Information panel with optional action button',
  category: 'display',
  macro: {
    path: 'info/macro.njk',
    name: 'appInfo'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Plain text content'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'HTML content'
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
      description: 'Apply inverse (dark) styling'
    },
    {
      name: 'isSlim',
      type: 'boolean',
      required: false,
      description: 'Apply compact styling with smaller icon'
    },
    {
      name: 'actionText',
      type: 'string',
      required: false,
      description: 'Text for optional action button'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Basic info',
      params: {
        html: '<p>You can deploy to multiple environments at once.</p>'
      }
    },
    {
      title: 'Inverse info',
      params: {
        html: '<p>You can deploy to multiple environments at once.</p>',
        isInverse: true
      }
    },
    {
      isInverse: true,
      title: 'Slim info',
      params: {
        text: 'Configuration changes require a redeploy.',
        isSlim: true
      }
    }
  ]
}
