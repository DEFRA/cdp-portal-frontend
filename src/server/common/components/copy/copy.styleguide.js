export const copyStyleguide = {
  name: 'copy',
  title: 'Copy',
  description: 'Copy-to-clipboard functionality with content wrapper',
  category: 'display',
  macro: {
    path: 'copy/macro.njk',
    name: 'appCopy'
  },
  params: [
    {
      name: 'content.id',
      type: 'string',
      required: true,
      description: 'Unique ID for the content element'
    },
    {
      name: 'content.text',
      type: 'string',
      required: false,
      description: 'Text content to display and copy'
    },
    {
      name: 'content.html',
      type: 'string',
      required: false,
      description: 'HTML content to display and copy'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Button title attribute (default: "Copy")'
    },
    {
      name: 'buttonIsAfter',
      type: 'boolean',
      required: false,
      description: 'Position copy button after content instead of before'
    }
  ],
  examples: [
    {
      title: 'Copy text',
      params: {
        content: {
          id: 'install-command',
          text: 'npm install cdp-portal'
        },
        title: 'Copy install command'
      }
    },
    {
      title: 'Copy with button after',
      params: {
        content: {
          id: 'api-key',
          text: 'abc123-def456-ghi789'
        },
        buttonIsAfter: true
      }
    }
  ]
}
