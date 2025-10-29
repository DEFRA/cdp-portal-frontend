import Boom from '@hapi/boom'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../helpers/schema/service-params-validation.js'
import { resourceByEnvironment } from '../transformers/resources-by-environment.js'

const environmentResourcesController = {
  options: {
    id: 'services/{serviceId}/resources/{environment}',
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { environment } = request.params
    const { entity } = request.app
    const serviceName = entity.name
    const environmentDetails = entity.environments[environment]

    const team = entity?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)

    const hasSqlDatabase = environmentDetails?.sql_database
    const resource = resourceByEnvironment({
      environment,
      environmentDetails
    })

    return h.view('services/service/resources/views/environment', {
      pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
      entity,
      teamId,
      environment,
      resource,
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
