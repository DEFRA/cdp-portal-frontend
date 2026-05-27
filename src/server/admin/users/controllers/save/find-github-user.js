import qs from 'qs'

import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { githubUserNameValidation } from '../../helpers/schema/github-user-name-validation.js'
import { sessionNames } from '#server/common/constants/session-names.js'

const findGithubUserController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const githubSearch = payload?.githubSearch || null
    const github = payload?.github || null

    const validationResult = githubUserNameValidation(button).validate(
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

      return h.redirect(`/admin/users/find-github-user${queryString}`)
    }

    if (!validationResult.error) {
      await request.app.saveStepData(
        {
          github: button === 'skip' ? null : github
        },
        h
      )

      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}`
        : `/admin/users/summary`

      return h.redirect(redirectTo)
    }
  }
}

export { findGithubUserController }
