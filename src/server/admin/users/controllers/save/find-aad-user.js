import qs from 'qs'

import { config } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { aadIdValidation } from '~/src/server/admin/users/helpers/schema/aad-id-validation'
import {
  saveToCdpUser,
  setStepComplete
} from '~/src/server/admin/users/helpers/form'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user'
import { searchAzureActiveDirectoryUsers } from '~/src/server/admin/users/helpers/search-azure-active-directory-users'

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
        { addQueryPrefix: true }
      )

      return h.redirect(
        config.get('appPathPrefix') + `/admin/users/find-aad-user${queryString}`
      )
    }

    if (!validationResult.error) {
      const searchAadUsersResponse = await searchAzureActiveDirectoryUsers(
        sanitisedPayload.email
      )
      const aadUserDetails = searchAadUsersResponse?.users ?? []
      const aadUser = aadUserDetails?.at(0)
      const isSameAsSession = aadUser?.mail && cdpUser?.email === aadUser?.email

      const updatedCdpUser = await saveToCdpUser(request, h, {
        ...sanitisedPayload,
        userId: aadUser?.userId ?? null,
        aadQuery: aadUser?.email ?? null,
        name: isSameAsSession ? cdpUser?.name : aadUser?.name
      })

      await setStepComplete(request, h, 'stepOne', updatedCdpUser)

      const queryString = qs.stringify(
        {
          ...(updatedCdpUser?.github && { githubSearch: updatedCdpUser.github })
        },
        { addQueryPrefix: true }
      )

      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}`
        : `/admin/users/find-github-user${queryString}`

      return h.redirect(config.get('appPathPrefix') + redirectTo)
    }
  }
}

export { findAadUserController }
