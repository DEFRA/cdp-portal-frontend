import qs from 'qs'

import { appConfig } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { aadIdValidation } from '~/src/server/admin/users/helpers/schema/aad-id-validation'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/save-to-cdp-user'
import { fetchAadUsers } from '~/src/server/admin/users/helpers/fetch-add-users'
import { sessionNames } from '~/src/server/common/constants/session-names'

const findAadUserController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const emailSearch = payload?.emailSearch || null
    const email = payload?.email || null

    const validationResult = aadIdValidation(button).validate(payload, {
      abortEarly: false
    })

    const sanitisedPayload = {
      emailSearch,
      email
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
          ...(emailSearch && { emailSearch })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(
        appConfig.get('appPathPrefix') +
          `/admin/users/create/find-aad-user${queryString}`
      )
    }

    if (!validationResult.error) {
      // TODO potentially just put an object on the dropdown rather than refetching
      const aadUserDetails = await fetchAadUsers(sanitisedPayload.email)

      saveToCdpUser(request, {
        ...sanitisedPayload,
        userId: aadUserDetails?.at(0)?.id ?? null,
        emailSearch: aadUserDetails?.at(0)?.mail ?? null
      })

      const redirectTo = redirectLocation
        ? `/admin/users/create/${redirectLocation}`
        : '/admin/users/create/find-github-user'

      return h.redirect(appConfig.get('appPathPrefix') + redirectTo)
    }
  }
}

export { findAadUserController }
