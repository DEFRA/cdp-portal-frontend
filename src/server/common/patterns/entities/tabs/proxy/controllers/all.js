import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../../helpers/environments/get-environments.js'
import { findAllProxyRules } from '../helpers/find-proxy-rules.js'
import { pluralise } from '../../../../../../../config/nunjucks/filters/filters.js'
import startCase from 'lodash/startCase.js'

export function allProxyController(entityType) {
  return {
    options: {
      id: `${pluralise(entityType)}/{serviceId}/proxy`,
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const entityName = request.params.serviceId
      const environments = getEnvironments(request.auth.credentials?.scope)
      const proxyRulesByEnvironment = await findAllProxyRules(
        entityName,
        environments
      )
      const hasServiceProxyRules = proxyRulesByEnvironment.some(
        (proxyRules) => proxyRules.rules.isProxySetup
      )

      return h.view('common/patterns/entities/tabs/proxy/views/all', {
        pageTitle: `${entityName} - Proxy`,
        entityName,
        proxyRulesByEnvironment,
        hasServiceProxyRules,
        entityType,
        breadcrumbs: [
          {
            text: pluralise(startCase(entityType)),
            href: `/${pluralise(entityType)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityType)}/${entityName}`
          },
          {
            text: 'Proxy'
          }
        ]
      })
    }
  }
}
