import Boom from '@hapi/boom'

import { config } from '../../../../../config/config.js'
import { canLaunchTerminal } from '../helpers/can-launch-terminal.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { terminalBrowserParamsValidation } from '../helpers/schema/terminal-browser-params-validation.js'

const terminalBrowserController = {
  options: {
    validate: {
      params: terminalBrowserParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
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

    try {
      canLaunchTerminal(request.auth.credentials?.scope, environment)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/services/${serviceId}`)
    }

    request.audit.send({
      event: 'terminal opened',
      user: {
        id: request.auth?.credentials?.id,
        name: request.auth?.credentials?.displayName
      },
      terminal: {
        token,
        environment,
        serviceId
      }
    })

    return h.view('services/service/terminal/views/terminal-browser', {
      pageTitle: `Terminal - ${serviceId} - ${environment}`,
      serviceId,
      environment,
      terminalProxyUrl
    })
  }
}

export { terminalBrowserController }
