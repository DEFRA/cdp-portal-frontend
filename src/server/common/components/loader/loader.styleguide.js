export const loaderStyleguide = {
  name: 'loader',
  title: 'Loader',
  description: 'Loading spinner animation',
  category: 'display',
  macro: {
    path: 'loader/macro.njk',
    name: 'appLoader'
  },
  params: [
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'Loader identifier for JavaScript control via data-js'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description:
        'Additional CSS classes (e.g., app-loader--small, app-loader--is-loading)'
    }
  ],
  examples: [
    {
      title: 'Basic loader',
      params: { classes: 'app-loader--is-loading' }
    },
    {
      title: 'Small loader',
      params: { classes: 'app-loader--small app-loader--is-loading' }
    },
    {
      title: 'Active loader',
      params: { classes: 'app-loader--is-loading' }
    }
  ]
}
