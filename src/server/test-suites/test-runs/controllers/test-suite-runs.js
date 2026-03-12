import { sessionNames } from '../../../common/constants/session-names.js'
import { runTest } from '../../helpers/fetch/run-test.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'

import {
  postProcessValidationErrors,
  testSuiteValidation
} from '../../helpers/schema/test-suite-validation.js'
import { getEnvironments } from '../../../common/helpers/environments/get-environments.js'
import { fetchTestSuites } from '../../../common/helpers/fetch/fetch-entities.js'

export const testSuiteRunsController = {
  handler: async (request, h) => {
    const payload = request.payload
    const { testSuite, environment, configuration } = request.payload
    const userSession = request.auth.credentials
    const userScopes = userSession?.scope

    const teamIds = userSession?.isAdmin ? [] : userScopes
    const testSuites = await fetchTestSuites({ teamIds })

    const testSuiteNames = testSuites.map((t) => t.name)
    const environments = getEnvironments(userScopes)

    const validationResult = testSuiteValidation(
      testSuiteNames,
      environments
    ).validate(payload, { abortEarly: false })

    if (validationResult?.error) {
      postProcessValidationErrors(validationResult)

      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails
      })

      return h.redirect(`/test-suites/${testSuite}`)
    }

    try {
      await runTest({
        request,
        testSuite,
        environment,
        configuration,
        profile: resolveProfile(payload)
      })

      request.audit.send({
        event: 'test run requested',
        user: { id: userSession.id, name: userSession.displayName },
        testRun: {
          testSuite,
          environment
        }
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'Test run requested successfully',
        type: 'success'
      })

      return h.redirect(`/test-suites/${testSuite}`)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/test-suites/${testSuite}`)
    }
  }
}

function resolveProfile(payload) {
  if (!payload.provideProfile) return undefined
  return payload.profile && payload.profile.trim() !== ''
    ? payload.profile
    : payload.newProfile
}
