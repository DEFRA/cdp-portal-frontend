// Response from portalBackendApi/secrets/infra-dev/cdp-portal-backend

const serviceSecretsFixture = {
  message: 'success',
  service: 'cdp-portal-backend',
  environment: 'infra-dev',
  keys: [
    'automated_placeholder',
    'SERVICE_SECRET',
    'a_lower_case_secret',
    'REDIS_KEY_PREFIX'
  ],
  lastChangedDate: '2024-08-02T16:02:23.9872730Z',
  createdDate: '2024-07-14T08:11:00',
  pending: [],
  exceptionMessage: null
}

const serviceSecretsWithPendingFixture = {
  message: 'success',
  service: 'cdp-portal-backend',
  environment: 'infra-dev',
  keys: [
    'automated_placeholder',
    'SERVICE_SECRET',
    'a_lower_case_secret',
    'REDIS_KEY_PREFIX'
  ],
  lastChangedDate: '2024-08-05T09:48:49.4822540Z',
  createdDate: '2024-07-14T08:11:00',
  pending: ['ANOTHER_SECRET'],
  exceptionMessage: null
}

const serviceSecretsWithExceptionFixture = {
  message: 'success',
  service: 'cdp-portal-backend',
  environment: 'infra-dev',
  keys: [
    'automated_placeholder',
    'SERVICE_SECRET',
    'a_lower_case_secret',
    'REDIS_KEY_PREFIX'
  ],
  lastChangedDate: '2024-08-05T09:48:49.4822540Z',
  createdDate: '2024-07-14T08:11:00',
  pending: [],
  exceptionMessage: 'Something really bad has happened'
}

export {
  serviceSecretsFixture,
  serviceSecretsWithPendingFixture,
  serviceSecretsWithExceptionFixture
}
