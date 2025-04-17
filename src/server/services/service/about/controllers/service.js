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
import { fetchMigrations } from '~/src/server/services/helpers/fetch/fetch-migrations.js'
import { hasScope, scopes } from '~/src/server/common/constants/scopes.js'

const availableEnvironments = ({ scopes, tenantServiceInfo }) => {
  const environments = getEnvironments(scopes)

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
    const hasPostgresPermission = hasScope(
      request,
      scopes.restrictedTechPostgres
    )
    const service = request.app.service
    const serviceName = service.serviceName
    const isServiceOwner = request.pre.isServiceOwner

    if (service === null) {
      return Boom.notFound()
    }

    const [availableVersions, vanityUrls, apiGateways, migrations] =
      await Promise.all([
        fetchAvailableVersions(serviceName),
        provideVanityUrls(request),
        provideApiGateways(request),
        fetchMigrations(serviceName)
      ])

    const latestPublishedImageVersions = availableVersions
      .sort(sortBy('created'))
      .slice(0, 6)

    const { runningServices } = await transformRunningServices(serviceName)

    const availableServiceEnvironments = availableEnvironments({
      scopes: request.auth?.credentials?.scope,
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
      latestPublishedImageVersions,
      migrations,
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
