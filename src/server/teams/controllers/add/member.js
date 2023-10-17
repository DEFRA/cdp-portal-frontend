import qs from 'qs'

import { config } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  addUserValidation,
  addMemberToTeam
} from '~/src/server/admin/teams/helpers'

const addMemberController = {
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId

    const payload = request?.payload
    const button = payload?.button

    const cdpUserQuery = payload?.cdpUserQuery || null
    const userIds = payload?.userIds
      ? Array.isArray(payload.userIds)
        ? payload?.userIds
        : [payload?.userIds]
      : []

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

      return h.redirect(
        config.get('appPathPrefix') +
          `/teams/${teamId}/add-member${queryString}`
      )
    }

    if (!validationResult.error) {
      const addUserToTeamPromises = userIds.map(
        async (userId) =>
          await addMemberToTeam(request.fetchWithAuth, teamId, userId)
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

        return h.redirect(config.get('appPathPrefix') + `/teams/${teamId}`)
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

      return h.redirect(config.get('appPathPrefix') + '/teams')
    }
  }
}

export { addMemberController }
