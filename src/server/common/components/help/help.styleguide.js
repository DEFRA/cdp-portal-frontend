export const helpStyleguide = {
  name: 'help',
  title: 'Help',
  description: 'Help message with automatic link to #cdp-support Slack channel',
  category: 'display',
  macro: {
    path: 'help/macro.njk',
    name: 'appHelp'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Help text content (automatically appends support link)'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'Help HTML content (automatically appends support link)'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Basic help',
      params: {
        text: 'Need assistance with deployments?'
      }
    }
  ]
}
