import { sessionNames } from '#server/common/constants/session-names.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { githubTeamNameValidation } from '../../helpers/schema/github-team-name-validation.js'

const findGithubTeamController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const github = payload?.github || null

    const validationResult = githubTeamNameValidation(button).validate(
      payload,
      {
        abortEarly: false
      }
    )

    const sanitisedPayload = {
      github
    }

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)
      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(`/admin/teams/find-github-team`)
    }

    if (!validationResult.error) {
      await request.app.saveStepData(
        {
          github: button === 'skip' ? null : github
        },
        h
      )

      return h.redirect(`/admin/teams/summary`)
    }
  }
}

export { findGithubTeamController }
