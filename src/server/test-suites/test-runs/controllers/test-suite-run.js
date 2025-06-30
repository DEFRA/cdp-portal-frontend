import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { runTest } from '~/src/server/test-suites/helpers/fetch/run-test.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'

import { testSuiteValidation } from '~/src/server/test-suites/helpers/schema/test-suite-validation.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchTestSuites } from '~/src/server/common/helpers/fetch/fetch-entities.js'

const triggerTestSuiteRunController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const payload = request.payload
    const { imageName, environment, profile } = request.payload
    const authedUser = await request.getUserSession()
    const userScopes = authedUser?.scope

    const teamIds = authedUser?.isAdmin ? [] : userScopes
    const testSuites = await fetchTestSuites({ teamIds })

    const testSuiteNames = testSuites.map((testSuite) => testSuite.name)
    const environments = getEnvironments(userScopes)

    const validationResult = testSuiteValidation(
      testSuiteNames,
      environments
    ).validate(payload, { abortEarly: false })

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
        await runTest({ request, imageName, environment, profile })

        request.audit.send({
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
      } catch (error) {
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(`/test-suites/${imageName}`)
      }
    }
  }
}

export { triggerTestSuiteRunController }
