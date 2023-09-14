import { appConfig } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { teamValidation } from '~/src/server/admin/teams/helpers/schema/team-validation'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

const editTeamController = {
  handler: async (request, h) => {
    const params = request?.params
    const payload = request?.payload

    const teamId = params.teamId
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

      return h.redirect(
        appConfig.get('appPathPrefix') + '/admin/teams/edit/' + teamId
      )
    }

    if (!validationResult.error) {
      const editTeamEndpointUrl =
        appConfig.get('userServiceApiUrl') + '/teams/' + teamId

      const response = await fetchWithAuth(
        request.yar?.get('auth'),
        editTeamEndpointUrl,
        {
          method: 'patch',
          body: JSON.stringify({
            name: sanitisedPayload.name,
            description: sanitisedPayload.description
          })
        }
      )
      const json = await response.json()

      if (response.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'Team updated',
          type: 'success'
        })

        return h.redirect(
          appConfig.get('appPathPrefix') + '/admin/teams/' + teamId
        )
      }

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })

      request.yar.flash(sessionNames.globalValidationFailures, json.message)

      request.yar.clear(sessionNames.cdpTeam)

      return h.redirect(
        appConfig.get('appPathPrefix') + '/admin/teams/edit/' + teamId
      )
    }
  }
}

export { editTeamController }
