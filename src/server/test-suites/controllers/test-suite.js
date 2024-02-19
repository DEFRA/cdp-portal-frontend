import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite'
import { serviceToEntityDataList } from '~/src/server/common/transformers/service-to-entity-data-list'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { fetchEnvironments } from '~/src/server/common/helpers/fetch/fetch-environments'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch'
import { transformTestSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results'

const testSuiteController = {
  options: {
    pre: [provideTestSuite],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const testSuite = request.pre.testSuite
    const serviceName = testSuite.serviceName
    const authedUser = await request.getUserSession()
    const environmentOptions = []

    if (authedUser.isInServiceTeam || authedUser.isAdmin) {
      const environments = await fetchEnvironments(request)
      environmentOptions.push(...buildOptions(environments))
    }

    const testRuns = await fetchTestRuns(serviceName)
    const testSuiteRunResults = testRuns.map(transformTestSuiteRunResults)

    return h.view('test-suites/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      heading: serviceName,
      testSuite,
      entityDataList: serviceToEntityDataList(testSuite),
      environmentOptions,
      testSuiteRunResults,
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
