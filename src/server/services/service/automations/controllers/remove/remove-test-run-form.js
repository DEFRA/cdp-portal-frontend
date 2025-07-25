import Joi from 'joi'
import Boom from '@hapi/boom'

import {
  fetchTestRepository,
  getAutoTestRunDetails
} from '../../helpers/fetchers.js'

const removeTestRunFormController = {
  options: {
    id: 'services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        testSuiteId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId

    const [autoTestRunDetails, repository] = await Promise.all([
      getAutoTestRunDetails(serviceId),
      fetchTestRepository(testSuiteId)
    ])

    return h.view('services/service/automations/views/remove-test-run', {
      pageTitle: `Remove Test Run | Automations - ${serviceId}`,
      serviceId,
      testSuiteId,
      testRun: {
        repository,
        environments: autoTestRunDetails?.testSuites?.[testSuiteId]
      },
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceId,
          href: `/services/${serviceId}`
        },
        {
          text: 'Automations',
          href: `/services/${serviceId}/automations`
        },
        {
          text: 'Test Runs',
          href: `/services/${serviceId}/automations/test-runs`
        },
        {
          text: 'Remove'
        }
      ]
    })
  }
}

export { removeTestRunFormController }
