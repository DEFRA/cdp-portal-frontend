import { sessionNames } from '../../../../common/constants/session-names.js'
import { createScope } from '../../helpers/fetchers.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { createPermissionValidation } from '../../helpers/schema/create-permission-validation.js'

const createPermissionDetailsController = {
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
        const createdScope = await createScope(request, {
          value,
          kind,
          description
        })

        request.yar.flash(sessionNames.notifications, {
          text: 'Permission created',
          type: 'success'
        })

        request.audit.sendMessage({
          event: `permission: ${value}:${createdScope.scopeId} created`,
          data: { value, scopeId: createdScope.scopeId }
        })

        return h.redirect(`/admin/permissions/${createdScope.scopeId}`)
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
