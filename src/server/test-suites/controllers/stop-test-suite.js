import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { stopTest } from '~/src/server/test-suites/helpers/fetch/stop-test'

const stopTestSuiteController = {
  options: {
    pre: [provideTestSuite]
  },
  handler: async (request, h) => {
    const suite = request.pre.testSuite
    const runId = request.params.runId

    try {
      await stopTest(request, runId)
      request.yar.flash(sessionNames.notifications, {
        text: `Stopping test run, this will take a few seconds.`,
        type: 'success'
      })
      return h.redirect(`/test-suites/${suite.serviceName}`)
    } catch (error) {
      request.logger.error(error)
      request.yar.flash(
        sessionNames.globalValidationFailures,
        `Failed to stop test suite ${runId}, ${error.message}.`
      )
      return h.redirect(`/test-suites/${suite.serviceName}`)
    }
  }
}

export { stopTestSuiteController }
