import qs from 'qs'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  saveToCdpTeam,
  setStepComplete
} from '~/src/server/admin/teams/helpers/form'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { githubTeamNameValidation } from '~/src/server/admin/teams/helpers/schema/github-team-name-validation'

const findGithubTeamController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const githubSearch = payload?.githubSearch || null
    const github = payload?.github || null

    const validationResult = githubTeamNameValidation(button).validate(
      payload,
      {
        abortEarly: false
      }
    )

    const sanitisedPayload = {
      githubSearch,
      github
    }

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(githubSearch && { githubSearch })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(
        config.get('appPathPrefix') +
          `/admin/teams/find-github-team${queryString}`
      )
    }

    if (!validationResult.error) {
      await saveToCdpTeam(request, h, {
        github: button === 'skip' ? null : github
      })

      await setStepComplete(request, h, 'stepTwo')

      return h.redirect(config.get('appPathPrefix') + '/admin/teams/summary')
    }
  }
}

export { findGithubTeamController }
