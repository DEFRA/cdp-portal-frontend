import Boom from '@hapi/boom'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { deployTerminal } from '../helpers/fetch/deploy-terminal.js'
import { canLaunchTerminal } from '../helpers/can-launch-terminal.js'
import { launchTerminalParamsValidation } from '../helpers/schema/launch-terminal-params-validation.js'

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

      const { payload } = await deployTerminal(request, serviceId, environment)

      request.audit.send({
        event: 'terminal requested',
        user: {
          id: request.auth.credentials.id,
          name: request.auth.credentials.displayName
        },
        terminal: payload
      })
      return h.redirect(
        `/services/${payload.service}/terminal/${payload.environment}/${payload.token}`
      )
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/services/${serviceId}`)
    }
  }
}

export { launchTerminalController }
