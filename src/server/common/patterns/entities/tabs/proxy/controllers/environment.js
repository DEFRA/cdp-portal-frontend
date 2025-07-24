import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import {
  formatText,
  pluralise
} from '../../../../../../../config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { findProxyRulesForEnvironment } from '../helpers/find-proxy-rules.js'

export function environmentProxyController(entityType) {
  return {
    options: {
      id: `${pluralise(entityType)}/{serviceId}/proxy/{environment}`,
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
        isProxySetup: proxyRules.rules.isProxySetup,
        allowedDomains: proxyRules.rules.allowedDomains,
        defaultDomains: proxyRules.rules.defaultDomains,
        breadcrumbs: [
          {
            text: `${pluralise(startCase(entityType))}`,
            href: `/${pluralise(entityType)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityType)}/${entityName}`
          },
          {
            text: 'Proxy-Rules',
            href: `/${pluralise(entityType)}/${entityName}/proxy`
          },
          {
            text: formattedEnvironment
          }
        ]
      })
    }
  }
}
