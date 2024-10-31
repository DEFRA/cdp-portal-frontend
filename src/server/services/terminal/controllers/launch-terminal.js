import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments } from '~/src/config/index.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deployTerminal } from '~/src/server/services/terminal/helpers/fetch/deploy-terminal.js'
import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal.js'

const launchTerminalController = {
  options: {
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        environment: Joi.string()
          .valid(...Object.values(environments).filter((env) => env !== 'prod'))
          .required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const environment = request.params.environment

    try {
      await canLaunchTerminal(request, environment)

      const { response, json } = await deployTerminal(
        request,
        serviceId,
        environment
      )

      if (response?.ok) {
        return h.redirect(
          `/services/${json.service}/terminal/${json.environment}/${json.token}`
        )
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/services/${serviceId}`)
    }
  }
}

export { launchTerminalController }
