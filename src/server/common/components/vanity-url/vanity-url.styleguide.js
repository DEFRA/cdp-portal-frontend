export const vanityUrlStyleguide = {
  name: 'vanity-url',
  title: 'Vanity URL',
  description:
    'Displays a vanity URL with optional shuttered warning indicator',
  category: 'display',
  macro: {
    path: 'vanity-url/macro.njk',
    name: 'appVanityUrl'
  },
  params: [
    {
      name: 'url',
      type: 'string',
      required: true,
      description: 'The vanity URL (without https prefix)'
    },
    {
      name: 'shuttered',
      type: 'boolean',
      required: false,
      description: 'Show shuttered warning icon'
    }
  ],
  examples: [
    {
      title: 'Basic URL',
      params: {
        url: 'cdp-portal.defra.gov.uk'
      }
    },
    {
      title: 'Shuttered URL',
      description: 'Shows warning icon when URL is shuttered',
      params: {
        url: 'maintenance.defra.gov.uk',
        shuttered: true
      }
    }
  ]
}
