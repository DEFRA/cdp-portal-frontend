import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '#server/common/constants/session-names.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
// import { autoTestRunValidation } from '../helpers/schema/auto-test-run-validation.js'
// import { saveAutoTestRunDetails } from '../helpers/fetchers.js'
import { postProcessValidationErrors } from '#server/test-suites/helpers/schema/test-suite-validation.js'

export default {
  options: {
    id: 'post:test-suites/{serviceId}/automations/create-schedule',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const payload = request.payload
    const userScopes = userSession?.scope
    const serviceId = request.params.serviceId
    const testSuite = payload.testSuite

    const environments = Array.isArray(payload.environments)
      ? payload.environments
      : [payload.environments].filter(Boolean)

    const provideProfile = payload.provideProfile
    const profile = payload.profile
    const newProfile = payload.newProfile

    const sanitisedPayload = {
      serviceId,
      testSuite,
      environments,
      provideProfile,
      profile,
      newProfile
    }

    // const validationResult = autoTestRunValidation(userScopes).validate(
    //   sanitisedPayload,
    //   { abortEarly: false }
    // )

    // if (validationResult?.error) {
    //   postProcessValidationErrors(validationResult)
    //   const errorDetails = buildErrorDetails(validationResult.error.details)

    //   request.yar.flash(sessionNames.validationFailure, {
    //     formValues: sanitisedPayload,
    //     formErrors: errorDetails
    //   })
    // } else {
    try {
      const { res } = await saveAutoTestRunDetails(validationResult.value)

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
    // }

    const redirectUrl = request.routeLookup(
      'test-suites/{serviceId}/automations',
      {
        params: { serviceId }
      }
    )
    return h.redirect(redirectUrl)
  }
}
