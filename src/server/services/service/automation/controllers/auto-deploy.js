import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { autoDeployValidation } from '~/src/server/services/service/automation/helpers/schema/auto-deploy-validation.js'
import { saveAutoDeployDetails } from '~/src/server/services/service/automation/helpers/fetchers.js'

const autoDeployController = {
  options: {
    id: 'services/{serviceId}/automation/auto-deploy',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userScopes = request.auth.credentials?.scope
    const serviceId = request.params.serviceId
    const payload = request.payload
    const environments = Array.isArray(payload.environments)
      ? payload.environments
      : [payload.environments].filter(Boolean)

    const redirectUrl = request.routeLookup('services/{serviceId}/automation', {
      params: { serviceId }
    })

    const sanitisedPayload = {
      serviceId,
      environments
    }

    const validationResult = autoDeployValidation(userScopes).validate(
      sanitisedPayload,
      { abortEarly: false }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(redirectUrl)
    }

    if (!validationResult.error) {
      try {
        const { res } = await saveAutoDeployDetails(sanitisedPayload)

        const successMessage =
          res?.status === 201
            ? 'Auto deploy details saved successfully'
            : 'Auto deploy details updated successfully'

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: successMessage,
          type: 'success'
        })

        return h.redirect(redirectUrl)
      } catch (error) {
        request.logger.debug({ error }, 'Save auto deploy details failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(redirectUrl)
      }
    }
  }
}

export { autoDeployController }
