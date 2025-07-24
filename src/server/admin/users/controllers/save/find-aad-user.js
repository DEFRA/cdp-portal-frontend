import qs from 'qs'

import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { aadIdValidation } from '../../helpers/schema/aad-id-validation.js'
import { saveToCdpUser, setStepComplete } from '../../helpers/form/index.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { provideCdpUser } from '../../helpers/pre/provide-cdp-user.js'
import { searchAzureActiveDirectoryUsers } from '../../helpers/fetch/index.js'

const findAadUserController = {
  options: {
    pre: [provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser

    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const aadQuery = payload?.aadQuery
    const email = payload?.email

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
          redirectLocation,
          aadQuery
        },
        { addQueryPrefix: true }
      )

      return h.redirect(`/admin/users/find-aad-user${queryString}`)
    }

    if (!validationResult.error) {
      const searchAadUsersResponse = await searchAzureActiveDirectoryUsers(
        sanitisedPayload.email
      )
      const aadUserDetails = searchAadUsersResponse?.users ?? []
      const aadUser = aadUserDetails?.at(0)
      const isSameEmail = cdpUser?.email === aadUser?.email
      const isSameAsSession = aadUser?.mail && isSameEmail

      const updatedCdpUser = await saveToCdpUser(request, h, {
        ...sanitisedPayload,
        userId: aadUser?.userId ?? null,
        aadQuery: aadUser?.email ?? null,
        name: isSameAsSession ? cdpUser?.name : aadUser?.name
      })

      await setStepComplete(request, h, 'stepOne', updatedCdpUser)

      const usersGitHub = updatedCdpUser?.github
      const queryString = usersGitHub
        ? qs.stringify({ githubSearch: usersGitHub }, { addQueryPrefix: true })
        : ''

      const redirectTo = redirectLocation
        ? `/admin/users/${redirectLocation}`
        : `/admin/users/find-github-user${queryString}`

      return h.redirect(redirectTo)
    }
  }
}

export { findAadUserController }
