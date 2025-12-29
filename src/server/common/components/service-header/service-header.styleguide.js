export const serviceHeaderStyleguide = {
  name: 'service-header',
  title: 'Service Header',
  description: 'Site-wide header with service name and auth status',
  category: 'layout',
  macro: {
    path: 'service-header/macro.njk',
    name: 'appServiceHeader'
  },
  params: [
    {
      name: 'serviceName',
      type: 'string',
      required: true,
      description: 'Name of the service'
    },
    {
      name: 'serviceUrl',
      type: 'string',
      required: true,
      description: 'URL for service name link'
    },
    {
      name: 'loginUrl',
      type: 'string',
      required: true,
      description: 'URL for login/logout action'
    },
    {
      name: 'loginText',
      type: 'string',
      required: true,
      description: 'Text for login button'
    },
    {
      name: 'isSensitiveEnvironment',
      type: 'boolean',
      required: false,
      description: 'Apply sensitive environment styling'
    }
  ],
  examples: [
    {
      title: 'Basic header',
      params: {
        serviceName: 'Core Delivery Platform',
        serviceUrl: '/',
        loginUrl: '/login',
        loginText: 'Sign in'
      }
    }
  ]
}
