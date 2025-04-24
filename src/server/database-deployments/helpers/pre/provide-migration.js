import { fetchMigrationRun } from '~/src/server/database-deployments/helpers/fetchers.js'
import { provideStatusClassname } from '~/src/server/database-deployments/helpers/provide-status-classname.js'

const provideMigration = {
  method: async function (request) {
    const migrationId = request.params?.migrationId
    const migration = await fetchMigrationRun(migrationId)

    return {
      ...migration,
      statusClasses: provideStatusClassname(migration.status)
    }
  },
  assign: 'migration'
}

export { provideMigration }
