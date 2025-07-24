import { sessionNames } from '../../../../common/constants/session-names.js'
import { createScope } from '../../helpers/fetchers.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { createPermissionValidation } from '../../helpers/schema/create-permission-validation.js'
import { provideAuthedUser } from '../../../../common/helpers/auth/pre/provide-authed-user.js'

const createPermissionDetailsController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const value = payload.value?.trim()
    const kind = Array.isArray(payload.kind)
      ? payload?.kind
      : [payload.kind].filter(Boolean)
    const description = payload.description?.trim() || null

    const sanitisedPayload = {
      value,
      kind,
      description
    }

    const validationResult = createPermissionValidation.validate(
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

      return h.redirect('/admin/permissions/create')
    }

    if (!validationResult.error) {
      try {
        const { payload: createScopePayload } = await createScope(request, {
          value,
          kind,
          description
        })

        request.yar.flash(sessionNames.notifications, {
          text: 'Permission created',
          type: 'success'
        })

        request.audit.sendMessage({
          event: `permission: ${value}:${createScopePayload.scope.scopeId} created by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
          data: {
            value,
            scopeId: createScopePayload.scope.scopeId
          },
          user: request.pre.authedUser
        })

        return h.redirect(
          `/admin/permissions/${createScopePayload.scope.scopeId}`
        )
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/admin/permissions/create')
      }
    }
  }
}

export { createPermissionDetailsController }
