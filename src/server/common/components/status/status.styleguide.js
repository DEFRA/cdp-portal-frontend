export const statusStyleguide = {
  name: 'status',
  title: 'Status',
  description: 'Workflow step status with GitHub links',
  category: 'data',
  macro: {
    path: 'status/macro.njk',
    name: 'appStatus'
  },
  params: [
    {
      name: 'part',
      type: 'number',
      required: true,
      description: 'Step number'
    },
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Step name'
    },
    {
      name: 'status.text',
      type: 'string',
      required: true,
      description: 'Status text'
    },
    {
      name: 'status.classes',
      type: 'string',
      required: true,
      description: 'Status tag CSS classes'
    },
    {
      name: 'info',
      type: 'function',
      required: false,
      description: 'Function returning additional info HTML'
    },
    {
      name: 'url.href',
      type: 'string',
      required: false,
      description: 'GitHub repository URL'
    },
    {
      name: 'url.text',
      type: 'string',
      required: false,
      description: 'GitHub repository display text'
    },
    {
      name: 'pullRequest.url.href',
      type: 'string',
      required: false,
      description: 'GitHub pull request URL'
    },
    {
      name: 'pullRequest.url.text',
      type: 'string',
      required: false,
      description: 'GitHub pull request display text'
    },
    {
      name: 'githubAction.url.href',
      type: 'string',
      required: false,
      description: 'GitHub action URL'
    },
    {
      name: 'githubAction.name',
      type: 'string',
      required: false,
      description: 'GitHub action name'
    },
    {
      name: 'errors',
      type: 'array',
      required: false,
      description: 'Array of error messages'
    }
  ],
  examples: [
    {
      title: 'Complete status',
      params: {
        part: 1,
        name: 'Repository Creation',
        status: { text: 'complete', classes: 'govuk-tag--green' },
        url: {
          href: 'https://github.com/DEFRA/cdp-example',
          text: 'DEFRA/cdp-example'
        }
      }
    },
    {
      title: 'In progress status',
      params: {
        part: 2,
        name: 'Infrastructure Setup',
        status: { text: 'in-progress', classes: 'govuk-tag--blue' }
      }
    }
  ]
}
