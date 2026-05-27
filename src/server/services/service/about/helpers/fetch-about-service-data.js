import { nullify404 } from '#server/common/helpers/nullify-404.js'
import { fetchRepository } from '#server/common/helpers/fetch/fetch-repository.js'
import { fetchLatestMigrations } from '#server/common/helpers/fetch/fetch-latest-migrations.js'
import { fetchAvailableMigrations } from '../../../helpers/fetch/fetch-available-migrations.js'
import { fetchAvailableVersions } from '#server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideDatabaseStatusClassname } from '#server/common/components/database-detail/provide-database-status-classname.js'

async function fetchAboutServiceData({ serviceName, isPostgres }) {
  const promises = []

  promises.push(
    fetchAvailableVersions(serviceName),
    fetchRepository(serviceName).catch(nullify404)
  )

  if (isPostgres) {
    promises.push(
      fetchAvailableMigrations(serviceName),
      fetchLatestMigrations(serviceName)
    )
  }

  const [
    availableVersions,
    repository,
    availableMigrations = [],
    latestMigrationsResponse = []
  ] = await Promise.all(promises)

  return {
    availableVersions,
    repository,
    availableMigrations,
    latestMigrations: latestMigrationsResponse.map((migration) => ({
      ...migration,
      statusClassname: provideDatabaseStatusClassname(migration.status)
    }))
  }
}

export { fetchAboutServiceData }
