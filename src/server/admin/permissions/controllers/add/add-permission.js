import qs from 'qs'
import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import {
  addScopeToTeam,
  addScopeToUser
} from '~/src/server/admin/permissions/helpers/fetchers.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { addPermissionValidation } from '~/src/server/admin/permissions/helpers/schema/add-permission-validation.js'
import { extractIds } from '~/src/server/admin/permissions/helpers/extract-ids.js'

function sendAuditLogs(request, userIds, teamIds, scopeId) {
  const auditUserPromises = userIds.map((userId) =>
    request.audit.sendMessage({
      event: `permission: ${scopeId} added to user: ${userId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
      data: {
        userId,
        scopeId
      },
      user: request.pre.authedUser
    })
  )
  const auditTeamPromises = teamIds.map((teamId) =>
    request.audit.sendMessage({
      event: `permission: ${scopeId} added to team: ${teamId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
      data: {
        teamId,
        scopeId
      },
      user: request.pre.authedUser
    })
  )

  return Promise.all([...auditUserPromises, ...auditTeamPromises])
}

const addPermissionController = {
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

    const searchQuery = payload?.searchQuery || null
    const entityIds = Array.isArray(payload.entityIds)
      ? payload.entityIds
      : [payload.entityIds].filter(Boolean)

    const validationResult = addPermissionValidation(
      entityIds,
      button
    ).validate(payload, { abortEarly: false })

    const sanitisedPayload = {
      searchQuery,
      entityIds
    }

    const queryString = qs.stringify(
      {
        ...(searchQuery && { searchQuery }),
        ...(entityIds.length && { entityIds })
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

      return h.redirect(`/admin/permissions/${scopeId}/add${queryString}`)
    }

    if (!validationResult.error) {
      const userIds = extractIds(entityIds, 'user')
      const teamIds = extractIds(entityIds, 'team')
      const addScopeToUserPromises = userIds.map((userId) =>
        addScopeToUser(request, userId, scopeId)
      )
      const addScopeToTeamPromises = teamIds.map((teamId) =>
        addScopeToTeam(request, teamId, scopeId)
      )

      const responses = await Promise.allSettled([
        ...addScopeToUserPromises,
        ...addScopeToTeamPromises
      ])
      const rejectedResponse = responses.filter(
        (response) => response.status === 'rejected'
      )
      const fulfilledResponse = responses.filter(
        (response) => response.status === 'fulfilled'
      )
      const message = pluralise('Permission', fulfilledResponse.length)

      if (rejectedResponse.length === 0) {
        request.yar.flash(sessionNames.notifications, {
          text: `${message} added`,
          type: 'success'
        })

        await sendAuditLogs(request, userIds, teamIds, scopeId)

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

      return h.redirect(`/admin/permissions/${scopeId}/add/${queryString}`)
    }
  }
}

export { addPermissionController }
