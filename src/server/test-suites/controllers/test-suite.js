import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch'
import { shouldPoll } from '~/src/server/test-suites/helpers/should-poll'
import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite'
import { transformTestSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results'
import { provideEnvironmentOptions } from '~/src/server/test-suites/helpers/pre/provide-environment-options'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'

const testSuiteController = {
  options: {
    pre: [[provideTestSuite], provideEnvironmentOptions, provideAuthedUser],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const testSuite = request.pre.testSuite
    const environmentOptions = request.pre.environmentOptions
    const serviceName = testSuite.serviceName

    const testRuns = await fetchTestRuns(serviceName)

    const isAdmin = request.pre.authedUser.isAdmin
    const actionsEnabled = testSuite.teams.some(
      (team) => isAdmin || request.userIsMemberOfATeam(team.teamId)
    )

    const testSuiteRunResults = testRuns.map((test) =>
      transformTestSuiteRunResults(test, actionsEnabled)
    )

    return h.view('test-suites/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      heading: serviceName,
      testSuite,
      entityDataList: testSuiteToEntityDataList(testSuite),
      environmentOptions,
      testSuiteRunResults,
      owningTeamIds: testSuite.teams.map((testsuite) => testsuite.teamId),
      shouldPoll: shouldPoll(testRuns),
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: serviceName
        }
      ]
    })
  }
}

export { testSuiteController }
