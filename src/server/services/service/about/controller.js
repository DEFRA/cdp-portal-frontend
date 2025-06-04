import Boom from '@hapi/boom'

import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideVanityUrls } from '~/src/server/services/service/about/transformers/vanity-urls.js'
import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { transformRunningServices } from '~/src/server/services/service/about/transformers/running-services.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideApiGateways } from '~/src/server/services/service/about/transformers/api-gateways.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchAvailableMigrations } from '~/src/server/services/helpers/fetch/fetch-available-migrations.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { provideDatabaseStatusClassname } from '~/src/server/common/components/database-detail/provide-database-status-classname.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'
import Joi from 'joi'

const availableEnvironments = ({ userScopes, tenantServiceInfo }) => {
  const environments = getEnvironments(userScopes)

  return Object.keys(tenantServiceInfo)
    .filter((e) => environments.includes(e))
    .sort(sortByEnv)
}

async function fetchData({ request, serviceName, isPostgres }) {
  const promises = []

  promises.push(
    fetchAvailableVersions(serviceName),
    provideVanityUrls(request),
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
    vanityUrls,
    apiGateways,
    repository,
    availableMigrations = [],
    latestMigrations = []
  ] = await Promise.all(promises)

  return {
    availableVersions,
    vanityUrls,
    apiGateways,
    repository,
    availableMigrations,
    latestMigrations
  }
}

const aboutServiceController = {
  options: {
    id: 'services/{serviceId}',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const entity = request.app.entity

    if (entity === null) {
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
      vanityUrls,
      apiGateways,
      repository,
      availableMigrations: migrations,
      latestMigrations
    } = await fetchData({
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
      vanityUrls,
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
}

export { aboutServiceController }
