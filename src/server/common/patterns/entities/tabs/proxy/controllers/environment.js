import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import {
  formatText,
  pluralise
} from '../../../../../../../config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { findProxyRulesForEnvironment } from '../helpers/find-proxy-rules.js'

export function environmentProxyController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/proxy/{environment}`,
      validate: {
        params: serviceParamsValidation,
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const environment = request.params.environment
      const entityName = request.params.serviceId
      const formattedEnvironment = formatText(environment)
      const proxyRules = await findProxyRulesForEnvironment(
        entityName,
        environment
      )

      return h.view('common/patterns/entities/tabs/proxy/views/environment', {
        pageTitle: `${entityName} - Proxy - ${formattedEnvironment}`,
        entityName,
        environment,
        entityKind,
        isProxySetup: proxyRules.rules.isProxySetup,
        allowedDomains: proxyRules.rules.allowedDomains,
        defaultDomains: proxyRules.rules.defaultDomains,
        breadcrumbs: [
          {
            text: `${pluralise(startCase(entityKind))}`,
            href: `/${pluralise(entityKind)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityKind)}/${entityName}`
          },
          {
            text: 'Proxy-Rules',
            href: `/${pluralise(entityKind)}/${entityName}/proxy`
          },
          {
            text: formattedEnvironment
          }
        ]
      })
    }
  }
}
