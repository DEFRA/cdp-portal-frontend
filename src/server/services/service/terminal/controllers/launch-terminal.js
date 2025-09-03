import Boom from '@hapi/boom'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { deployTerminal } from '../helpers/fetch/deploy-terminal.js'
import { launchTerminalParamsValidation } from '../helpers/schema/terminal-params-validation.js'
import { fetchActiveBreakGlass } from '../../../../admin/permissions/helpers/fetchers.js'

const launchTerminalController = {
  options: {
    validate: {
      params: launchTerminalParamsValidation,
      failAction: () => Boom.boomify(Boom.forbidden())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const environment = request.params.environment

    const { activeBreakGlass } = await fetchActiveBreakGlass(request)

    try {
      const { payload } = await deployTerminal({
        request,
        serviceId,
        environment,
        teamIds: request.app.entity.teams.map(({ teamId }) => teamId),
        expiresAt: activeBreakGlass?.endAt
      })

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
