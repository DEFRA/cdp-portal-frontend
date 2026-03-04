import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'

const rawResourcesController = {
  options: {
    id: 'services/{serviceId}/resources/raw',
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

    const environments = getEnvironments(request.auth.credentials?.scope)

    return h.view('services/service/resources/views/raw', {
      pageTitle: `${serviceName} - Resources`,
      entity,
      environments,
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

export { rawResourcesController }
