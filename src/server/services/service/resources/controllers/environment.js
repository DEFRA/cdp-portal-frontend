import Boom from '@hapi/boom'

import { formatText } from '#config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../helpers/schema/service-params-validation.js'
import { resourceByEnvironment } from '../transformers/resources-by-environment.js'

export const environmentResourcesController = {
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

    const team = entity?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)

    const resources = await fetchResources(entity.name, environment)

    const hasNoResources = !Object.entries(resources).find(
      ([_, items]) => items?.length
    )

    const debugView = request.query.debug ?? false
    const template = debugView
      ? 'services/service/resources/views/debug/environment'
      : 'services/service/resources/views/environment'

    return h.view(template, {
      pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
      entity,
      teamId,
      environment,
      resources,
      hasNoResources,
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
