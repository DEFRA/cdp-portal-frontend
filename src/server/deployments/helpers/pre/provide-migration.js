import { fetchMigrationRun } from '~/src/server/deployments/helpers/fetchers.js'
import { provideStatusClassname } from '~/src/server/deployments/helpers/provide-status-classname.js'

const provideMigration = {
  method: async function (request) {
    const migrationId = request.params?.migrationId
    const migration = await fetchMigrationRun(migrationId)

    return {
      ...migration,
      statusClass: provideStatusClassname(migration.status)
    }
  },
  assign: 'migration'
}

export { provideMigration }
