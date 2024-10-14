// Response from portalBackendApi/secrets/cdp-portal-backend

const allEnvironmentSecretsFixture = {
  'infra-dev': {
    keys: [
      'a_lower_case_secret',
      'automated_placeholder',
      'placeholder',
      'EXAMPLE_SECRET',
      'REDIS_KEY_PREFIX',
      'SESSION_COOKIE_PASSWORD'
    ],
    lastChangedDate: '2024-08-05T09:48:49.4822540Z',
    createdDate: '2024-07-14T08:11:00'
  },
  management: {
    keys: [
      'automated_placeholder',
      'placeholder',
      'AWESOME_SECRET',
      'REDIS_KEY_PREFIX'
    ],
    lastChangedDate: '2024-08-02T16:02:23.9872730Z',
    createdDate: '2024-07-14T08:11:00'
  },
  dev: {
    keys: [
      'automated_placeholder',
      'placeholder',
      'GOOGLE_APIS',
      'OS_MAP_ENDPOINT',
      'REDIS_KEY_PREFIX'
    ],
    lastChangedDate: '2024-08-02T16:08:35.2252690Z',
    createdDate: '2024-07-14T08:11:00'
  },
  test: {
    keys: [
      'automated_placeholder',
      'placeholder',
      'GOOGLE_APIS',
      'REDIS_KEY_PREFIX'
    ],
    lastChangedDate: '2024-08-03T08:07:32.7548580Z',
    createdDate: '2024-07-14T08:11:00'
  },
  'perf-test': {
    keys: [],
    lastChangedDate: null,
    createdDate: null
  },
  'ext-test': {
    keys: [],
    lastChangedDate: null,
    createdDate: null
  },
  prod: {
    keys: ['automated_placeholder', 'placeholder', 'REDIS_KEY_PREFIX'],
    lastChangedDate: '2024-08-02T14:10:17.3880790Z',
    createdDate: '2024-07-14T08:11:00'
  }
}

export { allEnvironmentSecretsFixture }
