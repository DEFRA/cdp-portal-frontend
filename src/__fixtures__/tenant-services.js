// Response from portalBackendApi/tenant-services/cdp-postgres-service

const tenantServicesFixture = {
  prod: {
    serviceCode: 'CDP',
    zone: 'protected',
    testSuite: 'cdp-env-test-suite',
    postgres: true
  },
  'perf-test': {
    serviceCode: 'CDP',
    zone: 'protected',
    testSuite: 'cdp-env-test-suite',
    postgres: true
  },
  dev: {
    serviceCode: 'CDP',
    zone: 'protected',
    testSuite: 'cdp-env-test-suite',
    postgres: true
  },
  test: {
    serviceCode: 'CDP',
    zone: 'protected',
    testSuite: 'cdp-env-test-suite',
    postgres: true
  },
  'ext-test': {
    serviceCode: 'CDP',
    zone: 'protected',
    testSuite: 'cdp-env-test-suite',
    postgres: true
  }
}

export { tenantServicesFixture }
