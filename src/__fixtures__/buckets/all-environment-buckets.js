// Response from portalBackendApi/buckets/cdp-portal-backend

const allEnvironmentBucketsFixture = {
  'infra-dev': {
    buckets: ['a_lower_case_bucket', 'z_ordered_bucket', 'EXAMPLE_BUCKET']
  },
  management: {
    buckets: ['AWESOME_BUCKET']
  },
  dev: {
    buckets: ['AWESOME_BUCKET']
  },
  test: {
    buckets: ['AWESOME_BUCKET']
  },
  'perf-test': {
    buckets: []
  },
  'ext-test': {
    buckets: []
  },
  prod: {
    buckets: ['AWESOME_BUCKET']
  }
}

export { allEnvironmentBucketsFixture }
