import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import {
  saveToCdpTeam,
  setStepComplete
} from '~/src/server/admin/teams/helpers/form/index.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { teamValidation } from '~/src/server/admin/teams/helpers/schema/team-validation.js'

const teamDetailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const redirectLocation = payload?.redirectLocation

    const name = payload?.name || undefined
    const serviceCode = payload?.serviceCode || undefined
    const description = payload?.description || undefined

    const sanitisedPayload = {
      name,
      serviceCode,
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
