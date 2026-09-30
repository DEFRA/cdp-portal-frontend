import Joi from 'joi'
import Boom from '@hapi/boom'
import upperFirst from 'lodash/upperFirst.js'

import { getTerminalEnvs } from '../helpers/get-terminal-envs.js'
import { buildTerminalBreadcrumbs } from '../helpers/build-terminal-breadcrumbs.js'
import { getAvailableTools } from '#server/services/service/terminal/helpers/get-available-tools.js'
import { getToolCards } from '#server/services/service/terminal/helpers/tool-cards.js'

const terminalEnvironmentController = {
  options: {
    id: 'services/{serviceId}/terminal/{environment}',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        environment: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { serviceId: serviceName, environment } = request.params
    const scopes = request.auth.credentials?.scope

    const terminalEnvs = await getTerminalEnvs({
      serviceName,
      userScopes: scopes,
      entity: request.app.entity
    })

    if (!terminalEnvs.includes(environment)) {
      return Boom.notFound()
    }

    const formattedEnvironment = upperFirst(environment)
    const toolCards = getToolCards(
      getAvailableTools(request.app.entity, environment, scopes)
    )

    return h.view('services/service/terminal/views/terminal', {
      pageTitle: `${serviceName} - Terminal - ${formattedEnvironment}`,
      serviceName,
      environment,
      toolCards,
      subNavigation: terminalEnvs.map((env) => ({
        isActive: env === environment,
        url: request.routeLookup(
          'services/{serviceId}/terminal/{environment}',
          { params: { serviceId: serviceName, environment: env } }
        ),
        label: { text: upperFirst(env) }
      })),
      breadcrumbs: buildTerminalBreadcrumbs(serviceName)
    })
  }
}

export { terminalEnvironmentController }
