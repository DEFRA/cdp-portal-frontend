export const timeStyleguide = {
  name: 'time',
  title: 'Time',
  description: 'Formatted timestamps with tooltip showing full date',
  category: 'display',
  macro: {
    path: 'time/macro.njk',
    name: 'appTime'
  },
  params: [
    {
      name: 'datetime',
      type: 'string',
      required: true,
      description: 'ISO 8601 timestamp'
    },
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Custom display text (overrides auto-formatting)'
    },
    {
      name: 'formatString',
      type: 'string',
      required: false,
      description: 'Custom date format string'
    },
    {
      name: 'withSeconds',
      type: 'boolean',
      required: false,
      description: 'Include seconds in relative time'
    },
    {
      name: 'withoutTooltip',
      type: 'boolean',
      required: false,
      description: 'Disable hover tooltip'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes for the time element'
    }
  ],
  examples: [
    {
      title: 'Relative time',
      description: 'Hover over time element for tooltip with full date',
      params: { datetime: new Date().toISOString() }
    },
    {
      title: 'Custom text',
      description: 'Hover over time element for tooltip with full date',
      params: {
        datetime: '2024-01-15T10:30:00Z',
        text: 'Last updated yesterday'
      }
    }
  ]
}
