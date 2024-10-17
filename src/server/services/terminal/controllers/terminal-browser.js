import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments, config } from '~/src/config'
import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal'
import { sessionNames } from '~/src/server/common/constants/session-names'

const webShellBrowserController = {
  options: {
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        environment: Joi.string()
          .valid(...Object.values(environments).filter((env) => env !== 'prod'))
          .required(),
        token: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const serviceId = params.serviceId
    const environment = params.environment
    const token = params.token
    const terminalUrl =
      config.get('terminalUrl').replace('{environment}', environment) +
      `/${token}`

    request.logger.info(
      `Terminal on url: ${terminalUrl} requested for ${serviceId} in ${environment}`
    )

    try {
      await canLaunchTerminal(request, environment)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/services/${serviceId}`)
    }

    return h.view('services/terminal/views/terminal-browser', {
      pageTitle: `Terminal - ${serviceId} - ${environment}`,
      serviceId,
      environment,
      terminalUrl
    })
  }
}

export { webShellBrowserController }
