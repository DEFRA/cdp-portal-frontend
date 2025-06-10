import Joi from 'joi'
import Boom from '@hapi/boom'

import { entityToSummary } from '~/src/server/services/service/maintenance/helpers/transformers/entity-to-summary.js'
import { fetchRunningServices } from '~/src/server/common/helpers/fetch/fetch-running-services.js'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'

const confirmUndeployController = {
  options: {
    id: 'services/{serviceId}/undeploy/confirm',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      query: Joi.object({
        environment: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const serviceId = request.params.serviceId
    const environment = request.query.environment
    const entity = request.app.entity

    if (entity === null) {
      return Boom.notFound()
    }

    const runningServices = await fetchRunningServices(serviceId)
    const runningService = runningServices.find(
      (rs) => rs.environment === environment
    )
    const deployedService = {
      ...runningService,
      statusClassname: provideDeploymentStatusClassname(runningService.status)
    }

    return h.view('services/service/maintenance/views/confirm-undeploy', {
      pageTitle: `Confirm Undeploy - ${serviceId}`,
      entity,
      environment,
      summaryList: entityToSummary(deployedService, environment, authedUser),
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
          text: 'Maintenance',
          href: `/services/${serviceId}/maintenance`
        },
        {
          text: 'Confirm Undeploy'
        }
      ]
    })
  }
}

export { confirmUndeployController }
