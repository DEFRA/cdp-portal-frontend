export const searchResultsStyleguide = {
  name: 'search-results',
  title: 'Search Results',
  description: 'Displays a list of search results with links',
  category: 'data',
  macro: {
    path: 'search-results/macro.njk',
    name: 'appSearchResults'
  },
  params: [
    {
      name: 'results',
      type: 'array',
      required: true,
      description: 'Array of result objects with text and value (URL)'
    }
  ],
  examples: [
    {
      title: 'Search results',
      params: {
        results: [
          {
            text: 'CDP Portal Frontend',
            value: '/services/cdp-portal-frontend'
          },
          {
            text: 'CDP Portal Backend',
            value: '/services/cdp-portal-backend'
          }
        ]
      }
    }
  ]
}
