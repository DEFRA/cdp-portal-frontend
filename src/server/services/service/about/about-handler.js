import Boom from '@hapi/boom'

import { scopes } from '~/src/server/common/constants/scopes.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'
import { availableEnvironments } from '~/src/server/services/service/about/helpers/available-environments.js'
import { transformRunningServices } from '~/src/server/services/service/about/transformers/running-services.js'
import { fetchAboutServiceData } from '~/src/server/services/service/about/helpers/fetch-about-service-data.js'
import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { provideDatabaseStatusClassname } from '~/src/server/common/components/database-detail/provide-database-status-classname.js'

async function aboutHandler(request, h) {
  const entity = request.app.entity

  if (entity == null) {
    return Boom.notFound()
  }

  const serviceName = entity.name
  const userScopes = request.auth?.credentials?.scope
  const isServiceOwner = userScopes?.includes(scopes.serviceOwner)
  const hasPostgresPermission = userScopes?.includes(
    scopes.restrictedTechPostgres
  )
  const latestCount = 6

  const tenantServices = await fetchTenantService(serviceName)
  const isPostgres = Object.values(tenantServices).some(
    (valueObj) => valueObj.postgres === true
  )

  const {
    availableVersions,
    apiGateways,
    repository,
    availableMigrations: migrations,
    latestMigrations
  } = await fetchAboutServiceData({
    request,
    serviceName,
    isPostgres
  })
  const latestPublishedImageVersions = availableVersions
    .sort(sortBy('created'))
    .slice(0, latestCount)
  const availableMigrations = migrations.slice(0, latestCount)

  const { runningServices } = await transformRunningServices(serviceName)

  const availableServiceEnvironments = availableEnvironments({
    userScopes,
    tenantServiceInfo: tenantServices
  })

  const isFrontend = entity.subType === 'Frontend'
  const isBackend = entity.subType === 'Backend'
  const description = repository?.description

  const service = {
    serviceName,
    isBackend,
    isFrontend,
    isPostgres,
    description
  }

  return h.view('services/service/about/views/about', {
    pageTitle: `${serviceName} microservice`,
    summaryList: transformServiceToSummary(repository, entity),
    apiGateways,
    service,
    isServiceOwner,
    hasPostgresPermission,
    availableServiceEnvironments,
    runningServices,
    latestPublishedImageVersions,
    availableMigrations,
    latestMigrations: latestMigrations.map((migration) => ({
      ...migration,
      statusClassname: provideDatabaseStatusClassname(migration.status)
    })),
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: serviceName
      }
    ]
  })
}

export { aboutHandler }
