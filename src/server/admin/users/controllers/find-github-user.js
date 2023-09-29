import qs from 'qs'

import { config } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { gitHubValidation } from '~/src/server/admin/users/helpers/schema/github-validation'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/save-to-cdp-user'
import { sessionNames } from '~/src/server/common/constants/session-names'

const findGitHubUserController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const githubSearch = payload?.githubSearch || null
    const github = payload?.github || null

    const validationResult = gitHubValidation(button).validate(payload, {
      abortEarly: false
    })

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
          `/admin/users/find-github-user${queryString}`
      )
    }

    if (!validationResult.error) {
      await saveToCdpUser(request, h, {
        github: button === 'skip' ? null : github
      })

      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}`
        : '/admin/users/user-details'

      return h.redirect(config.get('appPathPrefix') + redirectTo)
    }
  }
}

export { findGitHubUserController }
