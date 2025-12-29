export const progressStyleguide = {
  name: 'progress',
  title: 'Progress',
  description: 'Progress bar showing completion status',
  category: 'display',
  macro: {
    path: 'progress/macro.njk',
    name: 'appProgress'
  },
  params: [
    {
      name: 'progress',
      type: 'number',
      required: true,
      description: 'Percentage complete (0-100)'
    },
    {
      name: 'complete',
      type: 'number',
      required: true,
      description: 'Number of completed items'
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      description: 'Total number of items'
    }
  ],
  examples: [
    {
      title: 'Basic progress',
      params: { progress: 75, complete: 3, total: 4 }
    },
    {
      title: 'Completed',
      params: { progress: 100, complete: 5, total: 5 }
    }
  ]
}
