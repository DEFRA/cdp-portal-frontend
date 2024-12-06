import Boom from '@hapi/boom'

import { config } from '~/src/config/index.js'
import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { terminalBrowserParamsValidation } from '~/src/server/services/terminal/helpers/schema/terminal-browser-params-validation.js'

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

    return h.view('services/terminal/views/terminal-browser', {
      pageTitle: `Terminal - ${serviceId} - ${environment}`,
      serviceId,
      environment,
      terminalProxyUrl
    })
  }
}

export { terminalBrowserController }
