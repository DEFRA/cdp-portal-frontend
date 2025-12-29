export const toolTipStyleguide = {
  name: 'tool-tip',
  title: 'Tool Tip',
  description: 'Hover tooltip wrapper for additional information',
  category: 'display',
  macro: {
    path: 'tool-tip/macro.njk',
    name: 'appToolTip'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Tooltip text shown on hover (via data-text attribute)'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'HTML content to wrap (alternative to caller)'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    }
  ],
  examples: [
    {
      title: 'Basic tooltip',
      description: 'Hover over view link to show tooltip',
      params: {
        text: 'Click to view details',
        html: '<a href="/details">View</a>'
      }
    }
  ]
}
