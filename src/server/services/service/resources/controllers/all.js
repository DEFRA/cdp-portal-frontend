import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { resourcesByEnvironment } from '../transformers/resources-by-environment.js'
import { fetchResources } from '#server/services/helpers/fetch/fetch-resources.js'

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

    const environments = getEnvironments(request.auth.credentials?.scope)

    const resourcesPerEnv = await fetchResources(entity.name)

    return h.view('services/service/resources/views/all', {
      pageTitle: `${serviceName} - Resources`,
      entity,
      environments,
      resources,
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
