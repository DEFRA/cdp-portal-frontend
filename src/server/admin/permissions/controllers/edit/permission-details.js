import Boom from '@hapi/boom'

import Joi from '../../../../common/helpers/extended-joi.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { editPermissionValidation } from '../../helpers/schema/edit-permission-validation.js'
import { updateScope } from '../../helpers/fetchers.js'
import { provideAuthedUser } from '../../../../common/helpers/auth/pre/provide-authed-user.js'

const editPermissionDetailsController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const scopeId = request.params.scopeId
    const payload = request?.payload
    const kind = Array.isArray(payload.kind)
      ? payload?.kind
      : [payload.kind].filter(Boolean)
    const description = payload.description?.trim() || null

    const sanitisedPayload = {
      kind,
      description
    }

    const validationResult = editPermissionValidation.validate(
      sanitisedPayload,
      {
        abortEarly: false
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(`/admin/permissions/${scopeId}/edit`)
    }

    if (!validationResult.error) {
      try {
        await updateScope(request, scopeId, {
          kind,
          description
        })

        request.yar.flash(sessionNames.notifications, {
          text: 'Permission updated',
          type: 'success'
        })

        request.audit.sendMessage({
          event: `permission: ${scopeId} edited by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
          data: {
            scopeId
          },
          user: request.pre.authedUser
        })

        return h.redirect(`/admin/permissions/${scopeId}`)
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(`/admin/permissions/${scopeId}/edit`)
      }
    }
  }
}

export { editPermissionDetailsController }
