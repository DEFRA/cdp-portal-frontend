import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { teamValidation } from '~/src/server/admin/teams/helpers/schema/team-validation'
import { removeNil } from '~/src/server/common/helpers/remove-nil'

const createTeamController = {
  handler: async (request, h) => {
    const payload = request?.payload

    const name = payload?.name || null
    const description = payload?.description || null

    const sanitisedPayload = {
      name,
      description
    }

    const validationResult = teamValidation.validate(sanitisedPayload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(appConfig.get('appPathPrefix') + '/admin/teams/create')
    }

    if (!validationResult.error) {
      const createTeamEndpointUrl = `${appConfig.get(
        'userServiceApiUrl'
      )}/teams`

      const response = await fetch(createTeamEndpointUrl, {
        method: 'post',
        body: JSON.stringify(
          removeNil({
            name: sanitisedPayload.name,
            description: sanitisedPayload.description
          })
        ),
        headers: { 'Content-Type': 'application/json' }
      })
      const responseJson = await response.json()

      if (response.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'Team created',
          type: 'success'
        })

        return h.redirect(appConfig.get('appPathPrefix') + '/admin/teams')
      }

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })

      request.yar.flash(
        sessionNames.globalValidationFailures,
        responseJson.message
      )

      request.yar.clear(sessionNames.cdpTeam)

      return h.redirect(appConfig.get('appPathPrefix') + '/admin/teams/create')
    }
  }
}

export { createTeamController }
