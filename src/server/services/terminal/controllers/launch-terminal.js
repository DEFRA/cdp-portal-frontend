import Joi from 'joi'
import Boom from '@hapi/boom'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deployTerminal } from '~/src/server/services/terminal/helpers/fetch/deploy-terminal.js'
import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal.js'
import { getAllEnvironmentKebabNamesExceptProd } from '~/src/server/common/helpers/environments/get-environments.js'

const launchTerminalController = {
  options: {
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        environment: Joi.string()
          .valid(...getAllEnvironmentKebabNamesExceptProd())
          .required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const environment = request.params.environment

    try {
      canLaunchTerminal(request, environment)

      const { response, data } = await deployTerminal(
        request,
        serviceId,
        environment
      )

      if (response?.ok) {
        return h.redirect(
          `/services/${data.service}/terminal/${data.environment}/${data.token}`
        )
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/services/${serviceId}`)
    }
  }
}

export { launchTerminalController }
