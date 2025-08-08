import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { fetchTenantService } from '../../../../common/helpers/fetch/fetch-tenant-service.js'
import { allEnvironmentResources } from '../transformers/all-environment-resources.js'

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
    const entity = request.app.entity
    const serviceName = entity.name
    const environments = getEnvironments(request.auth.credentials?.scope)
    const tenantService = await fetchTenantService(serviceName)
    const resourcesByEnvironment = allEnvironmentResources(
      environments,
      tenantService
    )

    return h.view('services/service/resources/views/all', {
      pageTitle: `${serviceName} - Resources`,
      entity,
      resourcesByEnvironment,
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
