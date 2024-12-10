import qs from 'qs'
import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { addScopeToTeam } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { addTeamValidation } from '~/src/server/admin/permissions/helpers/schema/add-team-validation.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

const addPermissionToTeamController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const params = request.params
    const scopeId = params.scopeId

    const payload = request?.payload
    const button = payload?.button

    const cdpTeamQuery = payload?.cdpTeamQuery || null
    const teamIds = Array.isArray(payload.teamIds)
      ? payload.teamIds
      : [payload.teamIds].filter(Boolean)

    const validationResult = addTeamValidation(teamIds, button).validate(
      payload,
      { abortEarly: false }
    )

    const sanitisedPayload = {
      cdpTeamQuery,
      teamIds
    }

    const queryString = qs.stringify(
      {
        ...(cdpTeamQuery && { cdpTeamQuery }),
        ...(teamIds.length && { teamIds })
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

      return h.redirect(`/admin/permissions/${scopeId}/team/add${queryString}`)
    }

    if (!validationResult.error) {
      const addScopeToTeamPromises = teamIds.map((teamId) =>
        addScopeToTeam(request, teamId, scopeId)
      )

      const responses = await Promise.allSettled(addScopeToTeamPromises)
      const rejectedResponse = responses.filter(
        (response) => response.status === 'rejected'
      )
      const fulfilledResponse = responses.filter(
        (response) => response.status === 'fulfilled'
      )
      const message = pluralise('Permission', fulfilledResponse.length)

      if (rejectedResponse.length === 0) {
        request.yar.flash(sessionNames.notifications, {
          text: `${message} added to team`,
          type: 'success'
        })

        const auditPromises = teamIds.map((teamId) =>
          request.audit.sendMessage({
            event: `permission: ${scopeId} added to team: ${teamId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
            data: {
              teamId,
              scopeId
            },
            user: request.pre.authedUser
          })
        )
        await Promise.all(auditPromises)

        return h.redirect(`/admin/permissions/${scopeId}`)
      }

      if (fulfilledResponse.length) {
        request.yar.flash(sessionNames.notifications, {
          text: `${message} added to team`,
          type: 'success'
        })
      }

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })

      request.yar.flash(
        sessionNames.globalValidationFailures,
        rejectedResponse.map((response) => response.reason.message)
      )

      return h.redirect(`/admin/permissions/${scopeId}/team/add/${queryString}`)
    }
  }
}

export { addPermissionToTeamController }
