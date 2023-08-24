import qs from 'qs'

import { appConfig } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { aadIdValidation } from '~/src/server/admin/users/helpers/schema/aad-id-validation'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/save-to-cdp-user'
import { searchAadUsers } from '~/src/server/admin/users/helpers/search-add-users'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'

const findAadUserController = {
  options: {
    pre: [provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser

    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const aadQuery = payload?.aadQuery || null
    const email = payload?.email || null

    const validationResult = aadIdValidation(button).validate(payload, {
      abortEarly: false
    })

    const sanitisedPayload = {
      aadQuery,
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
          ...(aadQuery && { aadQuery })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(
        appConfig.get('appPathPrefix') +
          `/admin/users/find-aad-user${queryString}`
      )
    }

    if (!validationResult.error) {
      // TODO is there a better way to do this - feels flaky
      const aadUserDetails = await searchAadUsers(sanitisedPayload.email)
      const aadUser = aadUserDetails?.at(0)

      const isSameAsSession = aadUser?.mail && cdpUser?.email === aadUser?.email

      const updatedCdpUser = saveToCdpUser(request, {
        ...sanitisedPayload,
        userId: aadUser?.userId ?? null,
        aadQuery: aadUser?.email ?? null,
        name: isSameAsSession ? cdpUser?.name : aadUser?.name,
        aadName: isSameAsSession ? cdpUser?.aadName : aadUser?.name
      })

      // TODO tidy up
      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}`
        : `/admin/users/find-github-user${
            updatedCdpUser?.github
              ? `?githubSearch=${updatedCdpUser?.github}`
              : ''
          }`

      return h.redirect(appConfig.get('appPathPrefix') + redirectTo)
    }
  }
}

export { findAadUserController }
