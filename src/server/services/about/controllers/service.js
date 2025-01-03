import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { provideIsServiceOwner } from '~/src/server/services/helpers/pre/provide-is-service-owner.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideVanityUrls } from '~/src/server/services/about/transformers/vanity-urls.js'
import { transformServiceToSummary } from '~/src/server/services/about/transformers/service-to-summary.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { transformRunningServices } from '~/src/server/services/about/transformers/running-services.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

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
    const service = request.pre.service
    const isServiceOwner = request.pre.isServiceOwner

    if (service === null) {
      return Boom.notFound()
    }

    const availableVersions = await fetchAvailableVersions(service.serviceName)
    const latestPublishedImageVersions = availableVersions
      .sort(sortBy('created'))
      .slice(0, 6)
    const vanityUrls = await provideVanityUrls(request)

    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)

    const { runningServices, environmentsWithADeployment } =
      await transformRunningServices(service.serviceName)

    return h.view('services/about/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      summaryList: transformServiceToSummary(service),
      vanityUrls,
      service,
      isServiceOwner,
      environmentsWithADeployment,
      environments,
      runningServices,
      latestPublishedImageVersions,
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
