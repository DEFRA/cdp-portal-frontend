export const namingAdviceStyleguide = {
  name: 'naming-advice',
  title: 'Naming Advice',
  description: 'Naming conventions guidance panel for service creation',
  category: 'form',
  macro: {
    path: 'naming-advice/macro.njk',
    name: 'appNamingAdvice'
  },
  params: [
    {
      name: 'categories',
      type: 'array',
      required: true,
      description: 'List of valid category suffixes to suggest'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Service naming advice',
      params: {
        categories: ['frontend', 'backend', 'api', 'service']
      }
    }
  ]
}
