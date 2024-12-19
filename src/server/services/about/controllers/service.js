import Joi from 'joi'
import Boom from '@hapi/boom'
import compose from 'lodash/fp/compose.js'

import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { provideIsServiceOwner } from '~/src/server/services/helpers/pre/provide-is-service-owner.js'
import { withEnvironments } from '~/src/server/common/transformers/with-environments.js'
import { serviceToEntityDataList } from '~/src/server/services/about/transformers/service-to-entity-data-list.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings.js'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchVanityUrls } from '~/src/server/common/helpers/fetch/fetch-vanity-urls.js'

const serviceController = {
  options: {
    id: 'services/{serviceId}',
    pre: [[provideService], provideIsServiceOwner],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params?.serviceId
    const service = request.pre.service
    const isServiceOwner = request.pre.isServiceOwner

    if (service === null) {
      return Boom.notFound()
    }

    const availableVersions = await fetchAvailableVersions(service.serviceName)
    const environments = getEnvironments(request.auth.credentials?.scope)
    const runningServices = (await fetchRunningServicesById(serviceId)) ?? []

    const vanityUrls = await fetchVanityUrls(
      service.serviceName,
      request.logger
    )

    const envsWithVanityUrls = Object.entries(vanityUrls).filter(
      ([key, value]) => value && environments.includes(key)
    )

    const runningServicesEntityRows = compose(
      runningServicesToEntityRow(environments),
      withEnvironments
    )(runningServices)
    const envsWithDeployment = [
      ...new Set(
        runningServices.map((runningService) => runningService.environment)
      )
    ]
      .filter((env) => environments.includes(env))
      .sort(sortByEnv)

    return h.view('services/about/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      service,
      isServiceOwner,
      envsWithDeployment,
      envsWithVanityUrls,
      runningServicesEntityRows,
      heading: service.serviceName,
      rowHeadings: buildRunningServicesRowHeadings(environments),
      entityDataList: serviceToEntityDataList(service),
      latestVersions: availableVersions.slice(0, 4),
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: service.serviceName
        }
      ]
    })
  }
}

export { serviceController }
