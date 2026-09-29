import Joi from 'joi'
import Boom from '@hapi/boom'

import { getTerminalEnvs } from '../helpers/get-terminal-envs.js'
import { getAvailableTools } from '#server/services/service/terminal/helpers/get-available-tools.js'
import { getToolDescriptions } from '#server/services/service/terminal/helpers/tool-descriptions.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

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
    const scopes = request.auth.credentials?.scope

    const terminalEnvs = await getTerminalEnvs({
      serviceName,
      userScopes: scopes,
      entity: request.app.entity
    })
    const canLaunchTerminal = terminalEnvs.length > 0

    const availableTools = getAvailableTools(request.app.entity, scopes)
    const toolDescriptions = getToolDescriptions(availableTools)

    return h.view('services/service/terminal/views/terminal', {
      pageTitle: `${serviceName} - Terminal`,
      serviceName,
      canLaunchTerminal,
      terminalEnvs,
      tools: buildOptions(availableTools, false),
      toolDescriptions,
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
