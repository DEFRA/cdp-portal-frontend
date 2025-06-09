import Joi from 'joi'
import Boom from '@hapi/boom'

import { sortKeyByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { fetchShutteringUrls } from '~/src/server/services/helpers/fetch/fetch-shuttering-urls.js'
import { deploymentStatus } from '~/src/server/common/constants/deployment.js'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'
import { fetchRunningServices } from '~/src/server/common/helpers/fetch/fetch-running-services.js'

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

    const runningServices = await fetchRunningServices(serviceId)
    const deployedServices = runningServices
      .filter((service) => service.status === deploymentStatus.running)
      .map((service) => ({
        ...service,
        statusClassname: provideDeploymentStatusClassname(service.status)
      }))

    const shouldPoll = shutteringDetails.some((detail) =>
      detail.status.includes('Pending')
    )

    return h.view('services/service/maintenance/views/maintenance', {
      pageTitle: `Maintenance - ${serviceId}`,
      entity,
      shouldPoll,
      shutteringDetails: shutteringDetails.toSorted(
        sortKeyByEnv('environment')
      ),
      deployedServices,
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
