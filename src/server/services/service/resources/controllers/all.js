import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { fetchTenantService } from '../../../../common/helpers/fetch/fetch-tenant-service.js'
import { resourcesByEnvironment } from '../transformers/resources-by-environment.js'
import { fetchTenantDatabase } from '../../../../common/helpers/fetch/fetch-tenant-databases.js'

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
    const isPostgres = Object.values(tenantService).some(
      (valueObj) => valueObj.postgres === true
    )

    const tenantDatabase = isPostgres
      ? await fetchTenantDatabase(serviceName)
      : undefined
    const resources = resourcesByEnvironment({
      environments,
      tenantService,
      tenantDatabase
    })

    return h.view('services/service/resources/views/all', {
      pageTitle: `${serviceName} - Resources`,
      entity,
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

export { allResourcesController }
