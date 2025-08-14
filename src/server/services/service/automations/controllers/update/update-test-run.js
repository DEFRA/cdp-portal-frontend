import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../../common/constants/session-names.js'
import { updateAutoTestRun } from '../../helpers/fetchers.js'
import { provideAuthedUser } from '../../../../../common/helpers/auth/pre/provide-authed-user.js'
import { autoTestRunValidation } from '../../helpers/schema/auto-test-run-validation.js'
import { buildErrorDetails } from '../../../../../common/helpers/build-error-details.js'
import { provideNotFoundIfPrototype } from '../../../../../common/helpers/ext/provide-not-found-if-prototype.js'
import { provideNotFoundIfNull } from '../../../../../common/helpers/ext/provide-not-found-if-null.js'

const updateTestRunController = {
  options: {
    id: 'post:services/{serviceId}/automations/test-runs/{testSuiteId}/update',
    ext: {
      onPreAuth: [provideNotFoundIfPrototype, provideNotFoundIfNull]
    },
    pre: [provideAuthedUser],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        testSuiteId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const payload = request.payload
    const userScopes = authedUser.scope
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId
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
      testSuite: testSuiteId,
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
        await updateAutoTestRun(serviceId, sanitisedPayload)

        request.yar.flash(sessionNames.notifications, {
          text: 'Test run updated',
          type: 'success'
        })

        return h.redirect(redirectUrl)
      } catch (error) {
        request.logger.error({ error }, 'Auto test run update failed')
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(
          request.routeLookup(
            'services/{serviceId}/automations/test-runs/{testSuiteId}/update',
            { params: { serviceId, testSuiteId } }
          )
        )
      }
    }

    return h.redirect(redirectUrl)
  }
}

export { updateTestRunController }
