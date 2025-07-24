import { nullify404 } from '../../../../common/helpers/nullify-404.js'
import { fetchRepository } from '../../../../common/helpers/fetch/fetch-repository.js'
import { fetchLatestMigrations } from '../../../../common/helpers/fetch/fetch-latest-migrations.js'
import { provideApiGateways } from '../transformers/api-gateways.js'
import { fetchAvailableMigrations } from '../../../helpers/fetch/fetch-available-migrations.js'
import { fetchAvailableVersions } from '../../../../deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideDatabaseStatusClassname } from '../../../../common/components/database-detail/provide-database-status-classname.js'

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
