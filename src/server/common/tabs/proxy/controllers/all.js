import Joi from 'joi'
import Boom from '@hapi/boom'

import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { findAllProxyRules } from '~/src/server/common/tabs/proxy/helpers/find-proxy-rules.js'
import { pluralise } from '~/src/config/nunjucks/filters/filters.js'
import startCase from 'lodash/startCase.js'

export function allProxyController(serviceOrTestSuite) {
  return {
    options: {
      id: `${pluralise(serviceOrTestSuite)}/{serviceId}/proxy`,
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

      return h.view('common/tabs/proxy/views/all', {
        pageTitle: `${serviceName} - Proxy`,
        service,
        proxyRulesByEnvironment,
        hasServiceProxyRules,
        serviceOrTestSuite,
        breadcrumbs: [
          {
            text: pluralise(startCase(serviceOrTestSuite)),
            href: `/${pluralise(serviceOrTestSuite)}`
          },
          {
            text: serviceName,
            href: `/${pluralise(serviceOrTestSuite)}/${serviceName}`
          },
          {
            text: 'Proxy'
          }
        ]
      })
    }
  }
}
