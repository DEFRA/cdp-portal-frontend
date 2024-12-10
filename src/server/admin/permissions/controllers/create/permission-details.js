import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { createScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { createPermissionValidation } from '~/src/server/admin/permissions/helpers/schema/create-permission-validation.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

const createPermissionDetailsController = {
  options: {
    pre: [provideAuthedUser]
  },
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

          request.audit.sendMessage({
            event: `permission: ${value}:${data.scope.scopeId} created by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
            data: {
              value,
              scopeId: data.scope.scopeId
            },
            user: request.pre.authedUser
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
