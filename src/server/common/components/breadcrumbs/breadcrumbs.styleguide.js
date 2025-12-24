export const breadcrumbsStyleguide = {
  name: 'breadcrumbs',
  title: 'Breadcrumbs',
  description: 'Breadcrumb navigation trail',
  category: 'navigation',
  macro: {
    path: 'breadcrumbs/macro.njk',
    name: 'appBreadcrumbs'
  },
  params: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Array of breadcrumb items with text and optional href (last item has no href)'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    },
    {
      name: 'isSplitPane',
      type: 'boolean',
      required: false,
      description: 'Use split pane styling'
    }
  ],
  examples: [
    {
      title: 'Basic breadcrumbs',
      params: {
        items: [
          { text: 'Services', href: '/services' },
          {
            text: 'cdp-portal-frontend',
            href: '/services/cdp-portal-frontend'
          },
          { text: 'Deployments' }
        ]
      }
    }
  ]
}
