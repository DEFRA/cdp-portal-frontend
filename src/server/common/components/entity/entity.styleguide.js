export const entityStyleguide = {
  name: 'entity',
  title: 'Entity',
  description: 'Flexible entity display component with multiple types',
  category: 'data',
  macro: {
    path: 'entity/macro.njk',
    name: 'appEntity'
  },
  params: [
    {
      name: 'kind',
      type: 'string',
      required: true,
      description:
        'Entity type: link, tag, date, text, html, list, button, group'
    },
    {
      name: 'value',
      type: 'string|array',
      required: true,
      description: 'Entity value (varies by kind)'
    },
    {
      name: 'url',
      type: 'string',
      required: false,
      description: 'URL for link and tag kinds'
    },
    {
      name: 'newWindow',
      type: 'boolean',
      required: false,
      description: 'Open link in new window'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'CSS classes for tag or button kinds'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Optional label prefix'
    },
    {
      name: 'icon',
      type: 'string',
      required: false,
      description: 'HTML icon to display after link'
    },
    {
      name: 'showLoader',
      type: 'boolean',
      required: false,
      description: 'Show loading spinner (tag kind)'
    },
    {
      name: 'withSeconds',
      type: 'boolean',
      required: false,
      description: 'Include seconds in relative time (date kind)'
    },
    {
      name: 'formatString',
      type: 'string',
      required: false,
      description: 'Custom date format (date kind)'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Title attribute (text kind)'
    }
  ],
  examples: [
    {
      title: 'Link entity',
      params: {
        kind: 'link',
        value: 'cdp-portal-frontend',
        url: '/services/cdp-portal-frontend'
      }
    },
    {
      title: 'Tag entity',
      params: {
        kind: 'tag',
        value: 'Running',
        classes: 'govuk-tag--green'
      }
    },
    {
      title: 'Date entity',
      params: {
        kind: 'date',
        value: new Date().toISOString()
      }
    },
    {
      title: 'Text entity',
      params: {
        kind: 'text',
        value: 'Plain text content'
      }
    }
  ]
}
