import { latestMigrationsFixture } from '../../../../__fixtures__/migrations/latest-migrations.js'
import { provideDatabaseStatusClassname } from './provide-database-status-classname.js'

export const databaseDetailStyleguide = {
  name: 'database-detail',
  title: 'Database Detail',
  description: 'Database changelog status display across environments',
  category: 'data',
  macro: {
    path: 'database-detail/macro.njk',
    name: 'appDatabaseDetail'
  },
  params: [
    {
      name: 'serviceName',
      type: 'string',
      required: true,
      description: 'Service name for GitHub release links'
    },
    {
      name: 'environments',
      type: 'array',
      required: true,
      description: 'List of environment names to display'
    },
    {
      name: 'databaseDetails',
      type: 'array',
      required: true,
      description:
        'Array of database detail objects with environment, version, kind, statusClassname, cdpMigrationId, created, user'
    }
  ],
  examples: [
    {
      title: 'Database detail',
      params: {
        serviceName: 'cdp-example-node-postgres-be',
        databaseDetails: latestMigrationsFixture().map((migration) => ({
          ...migration,
          statusClassname: provideDatabaseStatusClassname(migration.status)
        })),
        environments: ['infra-dev', 'management', 'dev', 'test']
      }
    }
  ]
}
