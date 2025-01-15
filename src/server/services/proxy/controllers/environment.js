import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import { findProxyRulesForEnvironment } from '~/src/server/services/proxy/helpers/find-proxy-rules.js'

export const environmentProxyController = {
  options: {
    id: 'services/{serviceId}/proxy/{environment}',
    pre: [provideService],
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params.environment
    const service = request.pre.service
    const serviceName = service.serviceName
    const formattedEnvironment = formatText(environment)
    const proxyRules = await findProxyRulesForEnvironment(
      serviceName,
      environment
    )

    return h.view('services/proxy/views/environment', {
      pageTitle: `${serviceName} - Proxy - ${formattedEnvironment}`,
      service,
      environment,
      isProxySetup: proxyRules.rules.isProxySetup,
      allowedDomains: proxyRules.rules.allowedDomains,
      defaultDomains: proxyRules.rules.defaultDomains,
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
          href: `/services/${serviceName}/proxy`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}
