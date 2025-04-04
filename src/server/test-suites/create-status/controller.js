import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideServiceCreateStatus } from '~/src/server/common/helpers/pre/provide-service-create-status.js'
import { testSuiteStatus } from '~/src/server/test-suites/transformers/test-suite-status.js'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list.js'

const testSuiteStatusController = {
  options: {
    pre: [provideServiceCreateStatus],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const testSuite = request.pre.service

    if (!testSuite) {
      return null
    }

    const creationJob = testSuiteStatus(testSuite)
    const isSuccess = creationJob?.status?.isSuccess
    const creationPosition = isSuccess ? 'Created' : 'Creating'
    const serviceName = testSuite.serviceName
    const pageTitle = `${creationPosition} ${serviceName} test suite`
    const caption = `${creationPosition} the ${serviceName} test suite.`

    return h.view('test-suites/views/status', {
      pageTitle,
      creationJob,
      isSuccess,
      heading: serviceName,
      caption,
      entityDataList: testSuiteToEntityDataList(testSuite),
      testSuite,
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: testSuite.serviceName
        }
      ]
    })
  }
}

export { testSuiteStatusController }
