import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { resourcesByEnvironment } from '../transformers/resources-by-environment.js'

const allResourcesController = {
  options: {
    id: 'services/{serviceId}/resources',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { entity } = request.app
    const serviceName = entity.name
    const allEnvironmentsDetails = entity.envs

    const environments = getEnvironments(request.auth.credentials?.scope)
    const hasSqlDatabase = Object.values(allEnvironmentsDetails).some(
      ({ sql_database }) => sql_database
    )
    const resources = resourcesByEnvironment({
      environments,
      allEnvironmentsDetails
    })

    return h.view('services/service/resources/views/all', {
      pageTitle: `${serviceName} - Resources`,
      entity,
      resources,
      hasSqlDatabase,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceName,
          href: `/services/${serviceName}`
        },
        {
          text: 'Resources'
        }
      ]
    })
  }
}

export { allResourcesController }
