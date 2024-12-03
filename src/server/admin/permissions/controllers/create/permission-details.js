import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { createScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { createPermissionValidation } from '~/src/server/admin/permissions/helpers/schema/create-permission-validation.js'

const createPermissionDetailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const value = payload.value?.trim()
    const description = payload.description?.trim() || null

    const sanitisedPayload = {
      value,
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
        const { data, response } = await createScope(request, {
          value,
          description
        })

        if (response?.ok) {
          request.yar.flash(sessionNames.notifications, {
            text: 'Permission created',
            type: 'success'
          })

          return h.redirect(`/admin/permissions/${data.scope.scopeId}`)
        }
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
