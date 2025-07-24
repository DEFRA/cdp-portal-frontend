import { fetchMigrationRun } from '../fetchers.js'
import { provideStatusClassname } from '../provide-status-classname.js'

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
