import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { stopTest } from '~/src/server/test-suites/helpers/fetch/stop-test'

const stopTestSuiteController = {
  options: {
    pre: [provideTestSuite, provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const suite = request.pre.testSuite
    const runId = request.params.runId

    const isAdmin = authedUser.isAdmin
    const canStop = suite.teams.some(
      (team) => isAdmin || request.userIsMemberOfATeam(team.teamId)
    )

    if (!canStop) {
      request.yar.flash(sessionNames.globalValidationFailures, {
        text: 'You do not have permissions to stop this test suite',
        type: 'failure'
      })
      return h.redirect(`/test-suites/${suite.serviceName}`)
    }

    try {
      await stopTest(request, runId)
    } catch (error) {
      request.logger.error(error)
      request.yar.flash(
        sessionNames.globalValidationFailures,
        `Failed to stop test suite ${runId}, ${error}.`
      )
      return h.redirect(`/test-suites/${suite.serviceName}`)
    }

    request.yar.flash(sessionNames.notifications, {
      text: `Stopping test run, this will take a few seconds.`,
      type: 'success'
    })
    return h.redirect(`/test-suites/${suite.serviceName}`)
  }
}

export { stopTestSuiteController }
