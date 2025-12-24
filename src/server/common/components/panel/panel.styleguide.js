export const panelStyleguide = {
  name: 'panel',
  title: 'Panel',
  description: 'Container for grouping content with optional styling',
  category: 'display',
  macro: {
    path: 'panel/macro.njk',
    name: 'appPanel'
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
      description: 'Apply compact padding'
    },
    {
      name: 'withHighlight',
      type: 'boolean',
      required: false,
      description: 'Add left border highlight'
    },
    {
      name: 'testId',
      type: 'string',
      required: false,
      description: 'data-testid attribute value'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Basic panel',
      params: { text: 'Simple panel content' }
    },
    {
      isInverse: true,
      title: 'Highlighted panel',
      params: {
        html: '<p>Important information</p>',
        withHighlight: true
      }
    },
    {
      title: 'Inverse panel',
      params: {
        text: 'Dark themed panel',
        isInverse: true
      }
    }
  ]
}
