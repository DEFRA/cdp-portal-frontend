import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { autoTestRunValidation } from '../helpers/schema/auto-test-run-validation.js'
import { saveAutoTestRunDetails } from '../helpers/fetchers.js'
import { provideNotFoundIfPrototype } from '../../../../common/helpers/ext/provide-not-found-if-prototype.js'
import { provideNotFoundIfNull } from '../../../../common/helpers/ext/provide-not-found-if-null.js'

const setupAutoTestRunController = {
  options: {
    id: 'post:services/{serviceId}/automations/test-runs',
    ext: {
      onPreAuth: [provideNotFoundIfPrototype, provideNotFoundIfNull]
    },
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()
    const payload = request.payload
    const userScopes = userSession?.scope
    const serviceId = request.params.serviceId
    const testSuite = payload.testSuite
    const environments = Array.isArray(payload.environments)
      ? payload.environments
      : [payload.environments].filter(Boolean)

    const redirectUrl = request.routeLookup(
      'services/{serviceId}/automations/test-runs',
      {
        params: { serviceId }
      }
    )

    const sanitisedPayload = {
      serviceId,
      testSuite,
      environments
    }

    const validationResult = autoTestRunValidation(userScopes).validate(
      sanitisedPayload,
      { abortEarly: false }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })
    } else {
      try {
        const { res } = await saveAutoTestRunDetails(sanitisedPayload)

        const successMessage =
          res?.status === 201
            ? 'Auto test runs saved successfully'
            : 'Auto test runs updated successfully'

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: successMessage,
          type: 'success'
        })
      } catch (error) {
        request.logger.error({ error }, 'Auto test run failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
      }
    }
    return h.redirect(redirectUrl)
  }
}

export { setupAutoTestRunController }
