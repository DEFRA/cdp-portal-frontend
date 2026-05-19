import qs from 'qs'

import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { githubUserNameValidation } from '../../helpers/schema/github-user-name-validation.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import Joi from 'joi'

const findGithubUserController = {
  options: {
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

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

      return h.redirect(
        `/admin/users/find-github-user/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error) {
      await request.app.saveStepData(
        multiStepFormId,
        {
          github: button === 'skip' ? null : github
        },
        h
      )

      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}/${multiStepFormId}`
        : `/admin/users/summary/${multiStepFormId}`

      return h.redirect(redirectTo)
    }
  }
}

export { findGithubUserController }
