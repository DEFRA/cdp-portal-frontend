import Joi from 'joi'
import Boom from '@hapi/boom'

import {
  fetchTestRuns,
  fetchTestSuite
} from '~/src/server/test-suites/helpers/fetchers'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'

const testSuiteController = {
  options: {
    validate: {
      params: Joi.object({
        testSuiteId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const id = request.params?.testSuiteId
    const testSuite = await fetchTestSuite(id)
    const repo = await fetchRepository(id)
    const testRuns = await fetchTestRuns(id)

    return h.view('test-suites/views/testsuite', {
      pageTitle: `Test Suite - ${id}`,
      heading: id,
      testSuite,
      repo,
      testRuns
    })
  }
}

export { testSuiteController }
