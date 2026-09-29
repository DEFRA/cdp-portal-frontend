import Joi from 'joi'
import Boom from '@hapi/boom'

import { getTerminalEnvs } from '../helpers/get-terminal-envs.js'

const terminalController = {
  options: {
    id: 'services/{serviceId}/terminal',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceName = request.params.serviceId

    const terminalEnvs = await getTerminalEnvs({
      serviceName,
      userScopes: request.auth.credentials?.scope,
      entity: request.app.entity
    })

    if (terminalEnvs.length > 0) {
      return h.redirect(
        request.routeLookup('services/{serviceId}/terminal/{environment}', {
          params: { serviceId: serviceName, environment: terminalEnvs[0] }
        })
      )
    }

    return h.view('services/service/terminal/views/terminal', {
      pageTitle: `${serviceName} - Terminal`,
      serviceName,
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
          text: 'Terminal'
        }
      ]
    })
  }
}

export { terminalController }
