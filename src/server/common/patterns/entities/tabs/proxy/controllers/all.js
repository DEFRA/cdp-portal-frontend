import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { pluralise } from '#server/common/helpers/pluralise.js'
import startCase from 'lodash/startCase.js'
import { transformProxyRules } from '../transformers/transform-proxy-rules.js'
import { formatText } from '#config/nunjucks/filters/filters.js'

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

      const proxyRulesByEnvironment = Object.fromEntries(
        environments.map((env) => [
          env,
          transformProxyRules(entity.environments[env]?.squid)
        ])
      )

      const rows = [
        {
          'infra-dev': '',
          management: '',
          dev: '',
          test: '',
          'ext-test': '',
          'pref-test': '',
          prod: ''
        }
      ]

      const supportVerticalHeadings = environments.length >= 5

      return h.view('common/patterns/entities/tabs/proxy/views/all', {
        pageTitle: `${entityName} - Proxy`,
        entityName,
        environments,
        entityKind,
        tableData: {
          headers: [
            ...environments.map((env) => ({
              ...(supportVerticalHeadings && { verticalText: true }),
              id: env.toLowerCase(),
              text: formatText(env),
              width: env.length
            }))
          ],
          rows,
          noResult: 'Currently you have no proxy rules setup'
        },
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
