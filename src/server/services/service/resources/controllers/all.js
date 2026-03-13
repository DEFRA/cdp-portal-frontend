import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { resourcesByEnvironment } from '../transformers/resources-by-environment.js'

export const allResourcesController = {
  options: {
    id: 'services/{serviceId}/resources',
    validate: {
      query: Joi.object().keys({
        debug: Joi.boolean().default(false)
      }),
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { entity } = request.app
    const serviceName = entity.name
    const allEnvironmentsDetails = entity.environments

    const environments = getEnvironments(request.auth.credentials?.scope)
    const hasSqlDatabase = Object.values(allEnvironmentsDetails).some(
      ({ sql_database }) => sql_database
    )
    const resources = resourcesByEnvironment({
      environments,
      allEnvironmentsDetails
    })

    const debugView = request.query.debug ?? false
    const template = debugView
      ? 'services/service/resources/views/debug/all'
      : 'services/service/resources/views/all'

    return h.view(template, {
      pageTitle: `${serviceName} - Resources`,
      entity,
      environments,
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
