// Response from portalBackendApi/migrations/services/cdp-example-node-postgres-be
const latestMigrationsFixture = (
  serviceName = 'cdp-example-node-postgres-be'
) => [
  {
    cdpMigrationId: '38b6d1a8-aa9c-481b-85ba-bfbf014b368e',
    buildId: `arn:aws:codebuild:eu-west-2:666666666:build/${serviceName}-liquibase:75185528-cd7d-42af-b41b-b0d9531cfa23`,
    service: serviceName,
    environment: 'management',
    version: '1.0.0',
    kind: 'liquibase',
    user: {
      displayName: 'The Terminator',
      id: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
    },
    created: '2025-05-11T19:27:14.194Z',
    updated: '2025-05-11T19:27:14.211Z',
    status: 'SUCCEEDED'
  },
  {
    cdpMigrationId: 'ea832b92-4d62-4753-a496-97715d3d518f',
    buildId: `arn:aws:codebuild:eu-west-2:777777777:build/${serviceName}-liquibase:76fb44c1-1872-4d01-909a-cfc35c401a14`,
    service: serviceName,
    environment: 'infra-dev',
    version: '1.0.0',
    kind: 'liquibase',
    user: {
      id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      name: 'B. A. Baracus'
    },
    created: '2025-05-11T18:02:01.431Z',
    updated: '2025-05-11T18:02:01.45Z',
    status: 'SUCCEEDED'
  },
  {
    cdpMigrationId: '75be64bb-d36b-4f98-a177-4f3fdec7a6c6',
    buildId: `arn:aws:codebuild:eu-west-2:333333333:build/${serviceName}-liquibase:b7bec15d-0796-45b5-b00a-b47d09e2a34f`,
    service: serviceName,
    environment: 'dev',
    version: '0.7.0',
    kind: 'liquibase',
    user: {
      id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
      displayName: 'Mumm-ra'
    },
    created: '2025-05-11T15:59:24.328Z',
    updated: '2025-05-11T15:59:24.348Z',
    status: 'SUCCEEDED'
  },
  {
    cdpMigrationId: '150b8924-bdac-4e4d-899b-64979954eb6d',
    buildId: `arn:aws:codebuild:eu-west-2:444444444:build/${serviceName}-liquibase:1c03c6e6-7996-4e0d-9741-dbae36e268bc`,
    service: serviceName,
    environment: 'test',
    version: '1.0.0',
    kind: 'liquibase',
    user: {
      id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      name: 'B. A. Baracus'
    },
    created: '2025-05-12T10:03:44.875Z',
    updated: '2025-05-12T10:04:04.29Z',
    status: 'SUCCEEDED'
  }
]

export { latestMigrationsFixture }
