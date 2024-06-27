import { sessionNames } from '~/src/server/common/constants/session-names'
import { runTest } from '~/src/server/test-suites/helpers/fetch'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'

import { fetchRunnableTestSuiteImageNames } from '~/src/server/test-suites/helpers/fetch/fetch-runnable-test-suite-image-names'
import { testSuiteValidation } from '~/src/server/test-suites/helpers/schema/test-suite-validation'
import { provideCdpRequestId } from '~/src/server/common/helpers/audit/pre/provide-cdp-request-id'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

const triggerTestSuiteRunController = {
  options: {
    pre: [provideCdpRequestId, provideAuthedUser]
  },
  handler: async (request, h) => {
    const payload = request.payload
    const { imageName, environment } = request.payload

    const runnableTestSuiteImageNames =
      await fetchRunnableTestSuiteImageNames(request)

    const authedUser = await request.getUserSession()
    const environments = Object.values(getEnvironments(authedUser?.isAdmin))

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
      try {
        const { response } = await runTest(request, imageName, environment)

        if (response.ok) {
          await request.audit.send(request.pre?.cdpRequestId, {
            event: 'test run requested',
            user: { id: authedUser.id, name: authedUser.displayName },
            testRun: {
              imageName,
              environment
            }
          })

          request.yar.flash(sessionNames.notifications, {
            text: 'Test run requested successfully',
            type: 'success'
          })

          return h.redirect(`/test-suites/${imageName}`)
        }
      } catch (error) {
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(`/test-suites/${imageName}`)
      }
    }
  }
}

export { triggerTestSuiteRunController }
