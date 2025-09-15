// Response from portalBackendApi/tenant-databases/cdp-portal-backend

const tenantDatabasesFixture = {
  prod: {
    service: 'cdp-portal-backend',
    environment: 'prod',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:45.999Z'
  },
  'perf-test': {
    service: 'cdp-portal-backend',
    environment: 'perf-test',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:46.018Z'
  },
  dev: {
    service: 'cdp-portal-backend',
    environment: 'dev',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:46.026Z'
  },
  test: {
    service: 'cdp-portal-backend',
    environment: 'test',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:46.032Z'
  },
  management: {
    service: 'cdp-portal-backend',
    environment: 'management',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:46.037Z'
  },
  'infra-dev': {
    service: 'cdp-portal-backend',
    environment: 'infra-dev',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:46.044Z'
  },
  'ext-test': {
    service: 'cdp-portal-backend',
    environment: 'ext-test',
    databaseName: 'cdp_postgres_service',
    endpoint: 'cdp-portal-backend.cluster-aabbccdd.eu-west-2.rds.amazonaws.com',
    readerEndpoint:
      'cdp-portal-backend.cluster-ro-aabbccdd.eu-west-2.rds.amazonaws.com',
    port: 5432,
    engine: 'aurora-postgresql',
    engineVersion: '16.6',
    earliestRestorableTime: '2025-07-12T07:06:18.191Z',
    latestRestorableTime: '2025-08-11T15:06:08.796Z',
    backupRetentionPeriod: 30,
    updated: '2025-09-15T09:19:46.049Z'
  }
}
export { tenantDatabasesFixture }
