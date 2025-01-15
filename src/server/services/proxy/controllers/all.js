import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { findAllProxyRules } from '~/src/server/services/proxy/helpers/find-proxy-rules.js'

export const allProxyController = {
  options: {
    id: 'services/{serviceId}/proxy',
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const serviceName = service.serviceName
    const environments = getEnvironments(request.auth.credentials?.scope)
    const proxyRulesByEnvironment = await findAllProxyRules(
      serviceName,
      environments
    )
    const hasServiceProxyRules = proxyRulesByEnvironment.some(
      (proxyRules) => proxyRules.rules.isProxySetup
    )

    return h.view('services/proxy/views/all', {
      pageTitle: `${serviceName} - Proxy`,
      service,
      proxyRulesByEnvironment,
      hasServiceProxyRules,
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
          text: 'Proxy'
        }
      ]
    })
  }
}
