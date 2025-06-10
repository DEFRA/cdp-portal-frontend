import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { fetchRepository } from '~/src/server/common/helpers/fetch/fetch-repository.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { provideApiGateways } from '~/src/server/services/service/about/transformers/api-gateways.js'
import { fetchAvailableMigrations } from '~/src/server/services/helpers/fetch/fetch-available-migrations.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideDatabaseStatusClassname } from '~/src/server/common/components/database-detail/provide-database-status-classname.js'

async function fetchAboutServiceData({ request, serviceName, isPostgres }) {
  const promises = []

  promises.push(
    fetchAvailableVersions(serviceName),
    provideApiGateways(request),
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
    apiGateways,
    repository,
    availableMigrations = [],
    latestMigrationsResponse = []
  ] = await Promise.all(promises)

  return {
    availableVersions,
    apiGateways,
    repository,
    availableMigrations,
    latestMigrations: latestMigrationsResponse.map((migration) => ({
      ...migration,
      statusClassname: provideDatabaseStatusClassname(migration.status)
    }))
  }
}

export { fetchAboutServiceData }
