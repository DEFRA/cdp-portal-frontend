export const secretsListStyleguide = {
  name: 'secrets-list',
  title: 'Secrets List',
  description: 'Table of secret keys for a service environment',
  category: 'data',
  macro: {
    path: 'secrets-list/macro.njk',
    name: 'appSecretsList'
  },
  params: [
    {
      name: 'keys',
      type: 'array',
      required: false,
      description: 'Service-specific secret key names (shown in green)'
    },
    {
      name: 'platformKeys',
      type: 'array',
      required: false,
      description: 'Platform-provided secret key names (shown in grey)'
    },
    {
      name: 'lastChangedDate',
      type: 'string',
      required: false,
      description: 'ISO timestamp of last update'
    }
  ],
  examples: [
    {
      title: 'Secrets list',
      params: {
        keys: ['API_KEY', 'DATABASE_URL', 'REDIS_KEY_PREFIX'],
        platformKeys: ['CDP_HTTP_PROXY', 'CDP_HTTPS_PROXY'],
        lastChangedDate: '2024-08-02T16:02:23.987Z'
      }
    }
  ]
}
