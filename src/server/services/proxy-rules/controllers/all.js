import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

export const allProxyRulesController = {
  options: {
    id: 'services/{serviceId}/proxy-rules',
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const service = request.pre.service
    const serviceName = service.serviceName
    const environments = getEnvironments(request.auth.credentials?.scope)

    return h.view('services/proxy-rules/views/all', {
      pageTitle: `${serviceName} - Proxy Rules`,
      service,
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
          text: 'Proxy-Rules'
        }
      ]
    })
  }
}
