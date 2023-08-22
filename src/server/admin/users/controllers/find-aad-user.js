import qs from 'qs'

import { appConfig } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { aadIdValidation } from '~/src/server/admin/users/helpers/schema/aad-id-validation'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/save-to-cdp-user'
import { fetchAadUsers } from '~/src/server/admin/users/helpers/fetch-add-users'
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
          `/admin/users/find-aad-user${queryString}`
      )
    }

    if (!validationResult.error) {
      const aadUserDetails = await fetchAadUsers(sanitisedPayload.email)
      const aadUser = aadUserDetails?.at(0)

      const isSameAsSession = aadUser?.mail && cdpUser?.email === aadUser?.mail

      const updatedCdpUser = saveToCdpUser(request, {
        ...sanitisedPayload,
        userId: aadUser?.id ?? null,
        emailSearch: aadUser?.mail ?? null,
        name: isSameAsSession ? cdpUser?.name : aadUser?.displayName,
        aadName: isSameAsSession ? cdpUser?.aadName : aadUser?.displayName
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
