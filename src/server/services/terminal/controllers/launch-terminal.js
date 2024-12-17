import Boom from '@hapi/boom'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deployTerminal } from '~/src/server/services/terminal/helpers/fetch/deploy-terminal.js'
import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal.js'
import { launchTerminalParamsValidation } from '~/src/server/services/terminal/helpers/schema/launch-terminal-params-validation.js'

const launchTerminalController = {
  options: {
    validate: {
      params: launchTerminalParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const environment = request.params.environment

    try {
      canLaunchTerminal(request.auth.credentials?.scope, environment)

      const { response, data } = await deployTerminal(
        request,
        serviceId,
        environment
      )

      if (response?.ok) {
        request.audit.send({
          event: 'terminal requested',
          user: {
            id: request.auth.credentials.id,
            name: request.auth.credentials.displayName
          },
          terminal: data
        })
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
