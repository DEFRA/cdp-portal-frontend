import qs from 'qs'

import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { addMemberToTeam } from '~/src/server/admin/teams/helpers/fetch'
import { addUserValidation } from '~/src/server/admin/teams/helpers/schema/add-user-validation'

const addMemberController = {
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId

    const payload = request?.payload
    const button = payload?.button

    const cdpUserQuery = payload?.cdpUserQuery || null
    const userIds = Array.isArray(payload.userIds)
      ? payload?.userIds
      : [payload?.userIds].filter(Boolean)

    const validationResult = addUserValidation(userIds, button).validate(
      payload,
      {
        abortEarly: false
      }
    )

    const sanitisedPayload = {
      cdpUserQuery,
      userIds
    }

    const queryString = qs.stringify(
      {
        ...(cdpUserQuery && { cdpUserQuery }),
        ...(userIds?.length && { userIds })
      },
      {
        addQueryPrefix: true
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(`/teams/${teamId}/add-member${queryString}`)
    }

    if (!validationResult.error) {
      const addUserToTeamPromises = userIds.map(
        async (userId) => await addMemberToTeam(request, teamId, userId)
      )

      const responses = await Promise.allSettled(addUserToTeamPromises)
      const rejectedResponse = responses.filter(
        (response) => response.status === 'rejected'
      )
      const fulfilledResponse = responses.filter(
        (response) => response.status === 'fulfilled'
      )
      const memberMessage = fulfilledResponse.length > 1 ? 'Members' : 'Member'

      if (rejectedResponse.length === 0) {
        request.yar.flash(sessionNames.notifications, {
          text: `${memberMessage} added to team`,
          type: 'success'
        })

        return h.redirect(`/teams/${teamId}`)
      }

      if (fulfilledResponse.length) {
        request.yar.flash(sessionNames.notifications, {
          text: `${memberMessage} added to team`,
          type: 'success'
        })
      }

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })

      request.yar.flash(
        sessionNames.globalValidationFailures,
        rejectedResponse.map(
          (rejectedResponse) => rejectedResponse.reason.message
        )
      )

      return h.redirect('/teams')
    }
  }
}

export { addMemberController }
