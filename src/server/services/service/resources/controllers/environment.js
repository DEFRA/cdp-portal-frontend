import Boom from '@hapi/boom'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../helpers/schema/service-params-validation.js'
import { resourceByEnvironment } from '../transformers/resources-by-environment.js'
import { fetchTenantServiceByEnvironment } from '../../../../common/helpers/fetch/fetch-tenant-service.js'
import { fetchTenantDatabaseByEnvironment } from '../../../../common/helpers/fetch/fetch-tenant-databases.js'

const environmentResourcesController = {
  options: {
    id: 'services/{serviceId}/resources/{environment}',
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params.environment
    const entity = request.app.entity
    const serviceName = entity.name
    const team = entity?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)

    const tenantServiceForEnv = await fetchTenantServiceByEnvironment(
      serviceName,
      environment
    )
    const tenantDatabaseForEnv = await fetchTenantDatabaseByEnvironment(
      serviceName,
      environment
    )
    const resource = resourceByEnvironment({
      environment,
      tenantServiceForEnv,
      tenantDatabaseForEnv
    })

    return h.view('services/service/resources/views/environment', {
      pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
      entity,
      teamId,
      environment,
      resource,
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
          text: 'Resources',
          href: `/services/${serviceName}/resources`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}

export { environmentResourcesController }
