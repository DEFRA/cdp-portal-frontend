import Joi from 'joi'
import Boom from '@hapi/boom'

import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { findAllProxyRules } from '~/src/server/services/service/proxy/helpers/find-proxy-rules.js'

export const allProxyController = {
  options: {
    id: 'services/{serviceId}/proxy',
    pre: [preProvideService],
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

    return h.view('services/service/proxy/views/all', {
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
