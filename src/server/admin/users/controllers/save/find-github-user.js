import qs from 'qs'

import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { githubUserNameValidation } from '~/src/server/admin/users/helpers/schema/github-user-name-validation'
import {
  saveToCdpUser,
  setStepComplete
} from '~/src/server/admin/users/helpers/form'
import { sessionNames } from '~/src/server/common/constants/session-names'

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
      const updatedCdpUser = await saveToCdpUser(request, h, {
        github: button === 'skip' ? null : github
      })

      await setStepComplete(request, h, 'stepTwo', updatedCdpUser)

      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}`
        : '/admin/users/user-details'

      return h.redirect(redirectTo)
    }
  }
}

export { findGithubUserController }
