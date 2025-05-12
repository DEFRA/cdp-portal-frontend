// Response from portalBackendApi/migrations/services/cdp-example-node-postgres-be
const availableMigrationsFixture = (
  serviceName = 'cdp-example-node-postgres-be'
) => [
  {
    created: '2025-05-10T18:48:22+01:00',
    version: '0.3.0',
    path: `${serviceName}/0.3.0/migrations.tgz`,
    kind: 'liquibase'
  },
  {
    created: '2025-05-10T18:48:19+01:00',
    version: '0.2.0',
    path: `${serviceName}/0.2.0/migrations.tgz`,
    kind: 'liquibase'
  },
  {
    created: '2025-05-10T18:48:17+01:00',
    version: '0.1.0',
    path: `${serviceName}/0.1.0/migrations.tgz`,
    kind: 'liquibase'
  }
]

export { availableMigrationsFixture }
