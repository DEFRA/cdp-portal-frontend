import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideVanityUrls } from '~/src/server/services/service/about/transformers/vanity-urls.js'
import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { transformRunningServices } from '~/src/server/services/service/about/transformers/running-services.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideApiGateways } from '~/src/server/services/service/about/transformers/api-gateways.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { provideIsServiceOwner } from '~/src/server/services/helpers/pre/provide-is-service-owner.js'
import { fetchAvailableMigrations } from '~/src/server/services/helpers/fetch/fetch-available-migrations.js'
import { hasScope, scopes } from '~/src/server/common/constants/scopes.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'

const availableEnvironments = ({ userScopes, tenantServiceInfo }) => {
  const environments = getEnvironments(userScopes)

  return Object.keys(tenantServiceInfo)
    .filter((e) => environments.includes(e))
    .sort(sortByEnv)
}

const serviceController = {
  options: {
    id: 'services/{serviceId}',
    pre: [provideIsServiceOwner],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.app.service

    if (service === null) {
      return Boom.notFound()
    }

    const serviceName = service.serviceName
    const isServiceOwner = request.pre.isServiceOwner
    const latestCount = 6
    const hasPostgresPermission = hasScope(
      request,
      scopes.restrictedTechPostgres
    )

    // TODO branch in service.isPostgres
    const [
      availableVersions,
      vanityUrls,
      apiGateways,
      availableMigrations,
      latestMigrations
    ] = await Promise.all([
      fetchAvailableVersions(serviceName),
      provideVanityUrls(request),
      provideApiGateways(request),
      fetchAvailableMigrations(serviceName),
      fetchLatestMigrations(serviceName)
    ])
    const { runningServices } = await transformRunningServices(serviceName)

    // TODO refactor how this works
    const availableServiceEnvironments = availableEnvironments({
      userScopes: request.auth?.credentials?.scope,
      tenantServiceInfo: service.tenantServices
    })

    return h.view('services/service/about/views/service', {
      pageTitle: `${serviceName} microservice`,
      summaryList: transformServiceToSummary(service),
      vanityUrls,
      apiGateways,
      service,
      isServiceOwner,
      hasPostgresPermission,
      availableServiceEnvironments,
      runningServices,
      latestPublishedImageVersions: availableVersions
        .sort(sortBy('created'))
        .slice(0, latestCount),
      availableMigrations: availableMigrations.slice(0, latestCount),
      latestMigrations,
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

export { serviceController }
