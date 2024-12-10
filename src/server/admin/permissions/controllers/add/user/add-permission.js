import qs from 'qs'
import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { addScopeToUser } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { addUserValidation } from '~/src/server/admin/permissions/helpers/schema/add-user-validation.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

const addPermissionToUserController = {
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

    const cdpUserQuery = payload?.cdpUserQuery || null
    const userIds = Array.isArray(payload.userIds)
      ? payload.userIds
      : [payload.userIds].filter(Boolean)

    const validationResult = addUserValidation(userIds, button).validate(
      payload,
      { abortEarly: false }
    )

    const sanitisedPayload = {
      cdpUserQuery,
      userIds
    }

    const queryString = qs.stringify(
      {
        ...(cdpUserQuery && { cdpUserQuery }),
        ...(userIds.length && { userIds })
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

      return h.redirect(`/admin/permissions/${scopeId}/user/add${queryString}`)
    }

    if (!validationResult.error) {
      const addScopeToUserPromises = userIds.map((userId) =>
        addScopeToUser(request, userId, scopeId)
      )

      const responses = await Promise.allSettled(addScopeToUserPromises)
      const rejectedResponse = responses.filter(
        (response) => response.status === 'rejected'
      )
      const fulfilledResponse = responses.filter(
        (response) => response.status === 'fulfilled'
      )
      const message = pluralise('Permission', fulfilledResponse.length)

      if (rejectedResponse.length === 0) {
        request.yar.flash(sessionNames.notifications, {
          text: `${message} added to user`,
          type: 'success'
        })

        const auditPromises = userIds.map((userId) =>
          request.audit.sendMessage({
            event: `permission: ${scopeId} added to user: ${userId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
            data: {
              userId,
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
          text: `${message} added to user`,
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

      return h.redirect(`/admin/permissions/${scopeId}/user/add/${queryString}`)
    }
  }
}

export { addPermissionToUserController }
