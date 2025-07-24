import qs from 'qs'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { saveToCdpTeam, setStepComplete } from '../../helpers/form/index.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { githubTeamNameValidation } from '../../helpers/schema/github-team-name-validation.js'

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

      return h.redirect(`/admin/teams/find-github-team${queryString}`)
    }

    if (!validationResult.error) {
      const updatedTeam = await saveToCdpTeam(request, h, {
        github: button === 'skip' ? null : github
      })

      await setStepComplete(request, h, 'stepTwo', updatedTeam)

      return h.redirect('/admin/teams/summary')
    }
  }
}

export { findGithubTeamController }
