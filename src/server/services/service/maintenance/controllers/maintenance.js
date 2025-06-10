import Joi from 'joi'
import Boom from '@hapi/boom'

import { sortKeyByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { fetchRunningServices } from '~/src/server/common/helpers/fetch/fetch-running-services.js'
import { fetchShutteringUrls } from '~/src/server/services/helpers/fetch/fetch-shuttering-urls.js'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'

const maintenanceController = {
  options: {
    id: 'services/{serviceId}/maintenance',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const entity = request.app.entity

    if (entity === null) {
      return Boom.notFound()
    }

    const shutteringDetails = await fetchShutteringUrls(serviceId)
    const pendingShutter = shutteringDetails.find((s) =>
      s.status.includes('Pending')
    )

    const runningServicesResponse = await fetchRunningServices(serviceId)
    const runningServices = runningServicesResponse
      .map((service) => ({
        ...service,
        statusClassname: provideDeploymentStatusClassname(service.status)
      }))
      .toSorted(sortKeyByEnv('environment'))

    const shouldPoll = shutteringDetails.some((detail) =>
      detail.status.includes('Pending')
    )

    return h.view('services/service/maintenance/views/maintenance', {
      pageTitle: `Maintenance - ${serviceId}`,
      entity,
      shouldPoll,
      pendingShutter,
      shutteringDetails: shutteringDetails.toSorted(
        sortKeyByEnv('environment')
      ),
      runningServices,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceId,
          href: `/services/${serviceId}`
        },
        {
          text: 'Maintenance'
        }
      ]
    })
  }
}

export { maintenanceController }
