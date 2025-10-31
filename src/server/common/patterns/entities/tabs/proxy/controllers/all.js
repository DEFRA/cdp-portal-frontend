import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../../helpers/environments/get-environments.js'
import { pluralise } from '../../../../../helpers/pluralise.js'
import startCase from 'lodash/startCase.js'
import { transformProxyRules } from '../transformers/transform-proxy-rules.js'

export function allProxyController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/proxy`,
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const entity = request.app.entity
      const entityName = request.params.serviceId
      const environments = getEnvironments(
        request.auth.credentials?.scope,
        entity?.subType
      )

      const hasServiceProxyRules = Object.values(entity.environments).some(
        (env) => env.squid
      )

      const proxyRulesByEnvironment = environments.map((env) =>
        transformProxyRules(env, entity.environments[env]?.squid)
      )

      return h.view('common/patterns/entities/tabs/proxy/views/all', {
        pageTitle: `${entityName} - Proxy`,
        entityName,
        proxyRulesByEnvironment,
        hasServiceProxyRules,
        entityKind,
        breadcrumbs: [
          {
            text: pluralise(startCase(entityKind)),
            href: `/${pluralise(entityKind)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityKind)}/${entityName}`
          },
          {
            text: 'Proxy'
          }
        ]
      })
    }
  }
}
