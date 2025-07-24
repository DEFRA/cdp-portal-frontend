import qs from 'qs'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { saveToCdpTeam, setStepComplete } from '../../helpers/form/index.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { teamValidation } from '../../helpers/schema/team-validation.js'
import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'

const teamDetailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const redirectLocation = payload?.redirectLocation

    const name = payload.name
    const description = payload.description || undefined
    const serviceCode = payload.serviceCode || undefined
    const alertEmailAddresses = payload.alertEmailAddresses
      ? payload.alertEmailAddresses.split(/\s*,\s*/)
      : undefined
    const environments = getEnvironments(request.auth.credentials?.scope)
    const alertEnvironments = Array.isArray(payload.alertEnvironments)
      ? payload.alertEnvironments
      : [payload.alertEnvironments].filter(Boolean)

    const sanitisedPayload = {
      name,
      description,
      serviceCode,
      alertEmailAddresses,
      alertEnvironments
    }

    const validationResult = teamValidation(environments).validate(
      sanitisedPayload,
      {
        abortEarly: false
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(`/admin/teams/team-details${queryString}`)
    }

    if (!validationResult.error) {
      const cdpTeam = await saveToCdpTeam(request, h, {
        ...sanitisedPayload
      })

      await setStepComplete(request, h, 'stepOne')

      const queryString = qs.stringify(
        {
          ...(cdpTeam?.github && { githubSearch: cdpTeam?.github ?? '' })
        },
        { addQueryPrefix: true }
      )

      const redirectTo = redirectLocation
        ? `/admin/teams/${redirectLocation}`
        : `/admin/teams/find-github-team${queryString}`

      return h.redirect(redirectTo)
    }
  }
}

export { teamDetailsController }
