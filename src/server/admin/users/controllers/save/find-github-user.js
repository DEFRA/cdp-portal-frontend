import qs from 'qs'

import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { githubUserNameValidation } from '../../helpers/schema/github-user-name-validation.js'
import { saveToCdpUser, setStepComplete } from '../../helpers/form/index.js'
import { sessionNames } from '../../../../common/constants/session-names.js'

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
