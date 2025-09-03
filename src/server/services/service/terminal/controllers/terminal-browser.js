import Boom from '@hapi/boom'

import { config } from '../../../../../config/config.js'
import { terminalBrowserParamsValidation } from '../helpers/schema/terminal-params-validation.js'

const terminalBrowserController = {
  options: {
    validate: {
      params: terminalBrowserParamsValidation,
      failAction: () => Boom.boomify(Boom.forbidden())
    }
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()
    const params = request.params
    const serviceId = params.serviceId
    const environment = params.environment
    const token = params.token
    const terminalProxyUrl =
      config.get('terminalProxyUrl').replace('{environment}', environment) +
      `/${token}`

    request.logger.info(
      `Terminal on url: ${terminalProxyUrl} requested for ${serviceId} in ${environment}`
    )

    request.audit.send({
      event: 'terminal opened',
      user: {
        id: userSession?.id,
        name: userSession?.displayName
      },
      terminal: {
        token,
        environment,
        serviceId
      }
    })

    return h.view('services/service/terminal/views/terminal-browser', {
      pageTitle: `Terminal - ${environment} - ${serviceId}`,
      serviceId,
      environment,
      terminalProxyUrl
    })
  }
}

export { terminalBrowserController }
