import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { provideIsServiceOwner } from '~/src/server/services/helpers/pre/provide-is-service-owner.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { provideRunningServicesData } from '~/src/server/services/about/transformers/running-services.js'
import { provideVanityUrls } from '~/src/server/services/about/transformers/vanity-urls.js'
import { transformServiceToSummary } from '~/src/server/services/about/transformers/service-to-summary.js'

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
    const latestPublishedImageVersions = availableVersions.slice(0, 6)
    const vanityUrls = await provideVanityUrls(request)
    const {
      rowHeadings,
      runningServicesEntityRows,
      environmentsWithADeployment
    } = await provideRunningServicesData(request)

    return h.view('services/about/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      heading: service.serviceName,
      summaryList: transformServiceToSummary(service),
      vanityUrls,
      service,
      isServiceOwner,
      environmentsWithADeployment,
      runningServicesEntityRows,
      rowHeadings,
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
