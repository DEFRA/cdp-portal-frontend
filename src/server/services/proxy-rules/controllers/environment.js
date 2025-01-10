import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'

export const environmentProxyRulesController = {
  options: {
    id: 'services/{serviceId}/proxy-rules/{environment}',
    pre: [provideService],
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const environment = request.params.environment
    const service = request.pre.service
    const serviceName = service.serviceName
    const team = service?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)

    return h.view('services/proxy-rules/views/environment', {
      pageTitle: `${serviceName} - Proxy Rules - ${formattedEnvironment}`,
      service,
      teamId,
      environment,
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
          text: 'Proxy-Rules',
          href: `/services/${serviceName}/proxy-rules`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}
