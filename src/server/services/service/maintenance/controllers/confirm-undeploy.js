import Joi from 'joi'
import Boom from '@hapi/boom'

import { entityToSummary } from '../helpers/transformers/entity-to-summary.js'
import { fetchRunningServices } from '../../../../common/helpers/fetch/fetch-running-services.js'
import { provideDeploymentStatusClassname } from '../../../../deployments/helpers/provide-deployment-status-classname.js'

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
    const userSession = request.auth.credentials
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

    const isFrontend = entity.subType === 'Frontend'

    return h.view('services/service/maintenance/views/confirm-undeploy', {
      pageTitle: `Confirm Undeploy - ${serviceId}`,
      entity,
      environment,
      summaryList: entityToSummary({
        entity,
        deployedService,
        environment,
        userSession,
        isFrontend
      }),
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
