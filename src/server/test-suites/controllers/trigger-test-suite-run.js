import { sessionNames } from '~/src/server/common/constants/session-names'
import { runTest } from '~/src/server/test-suites/helpers/fetch'
import { fetchEnvironments } from '~/src/server/common/helpers/fetch/fetch-environments'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'

import { fetchRunnableTestSuiteImageNames } from '~/src/server/test-suites/helpers/fetch/fetch-runnable-test-suite-image-names'
import { testSuiteValidation } from '~/src/server/test-suites/helpers/schema/test-suite-validation'

const triggerTestSuiteRunController = {
  handler: async (request, h) => {
    const payload = request.payload
    const { imageName, environment } = request.payload

    const runnableTestSuiteImageNames =
      await fetchRunnableTestSuiteImageNames(request)
    const environments = await fetchEnvironments(request)

    const validationResult = testSuiteValidation(
      runnableTestSuiteImageNames,
      environments
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails
      })

      return h.redirect(`/test-suites/${imageName}`)
    }

    if (!validationResult.error) {
      const { json, response } = await runTest(request, imageName, environment)

      if (response.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'Test run requested successfully',
          type: 'success'
        })

        return h.redirect(`/test-suites/${imageName}`)
      }

      request.yar.flash(sessionNames.globalValidationFailures, json.message)

      return h.redirect(`/test-suites/${imageName}`)
    }
  }
}

export { triggerTestSuiteRunController }
