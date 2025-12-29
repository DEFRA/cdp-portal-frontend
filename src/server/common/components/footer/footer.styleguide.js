export const footerStyleguide = {
  name: 'footer',
  title: 'Footer',
  description:
    'Site footer with links and version info. Uses global context variables (supportChannel, serviceVersion).',
  category: 'layout',
  macro: {
    path: 'footer/macro.njk',
    name: 'appFooter'
  },
  params: [],
  examples: [
    {
      isInverse: true,
      title: 'Basic footer',
      description: 'Uses global context variables for content'
    }
  ]
}
