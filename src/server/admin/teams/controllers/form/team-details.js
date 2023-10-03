import qs from 'qs'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  saveToCdpTeam,
  setStepComplete
} from '~/src/server/admin/teams/helpers/form'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { teamValidation } from '~/src/server/admin/teams/helpers/schema/team-validation'

const teamDetailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const redirectLocation = payload?.redirectLocation

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

      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(
        config.get('appPathPrefix') + `/admin/teams/team-details${queryString}`
      )
    }

    if (!validationResult.error) {
      const cdpTeam = await saveToCdpTeam(request, h, {
        ...sanitisedPayload
      })

      await setStepComplete(request, h, 'stepOne')

      const queryString = qs.stringify(
        {
          ...(cdpTeam?.isEdit && { githubSearch: cdpTeam?.github ?? '' })
        },
        { addQueryPrefix: true }
      )

      const redirectTo = redirectLocation
        ? `/admin/teams/${redirectLocation}`
        : `/admin/teams/find-github-team${queryString}`

      return h.redirect(config.get('appPathPrefix') + redirectTo)
    }
  }
}

export { teamDetailsController }
