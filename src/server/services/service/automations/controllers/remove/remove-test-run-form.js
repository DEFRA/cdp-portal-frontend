import Joi from 'joi'
import Boom from '@hapi/boom'

import { getAutoTestRunDetails } from '../../helpers/fetchers.js'
import { provideNotFoundIfPrototype } from '../../../../../common/helpers/ext/provide-not-found-if-prototype.js'
import { provideNotFoundIfNull } from '../../../../../common/helpers/ext/provide-not-found-if-null.js'
import { fetchEntity } from '../../../../../common/helpers/fetch/fetch-entities.js'
import { renderTestSuiteTagHtml } from '../../helpers/render-test-suite-tag-html.js'
import {
  profileValidation,
  repositoryNameValidation
} from '@defra/cdp-validation-kit'

const removeTestRunFormController = {
  options: {
    id: 'services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
    ext: {
      onPreAuth: [provideNotFoundIfPrototype, provideNotFoundIfNull]
    },
    validate: {
      params: Joi.object({
        serviceId: repositoryNameValidation,
        testSuiteId: repositoryNameValidation
      }),
      query: Joi.object({
        profile: profileValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId
    const profile = request.query.profile

    const [autoTestRunDetails, testSuite] = await Promise.all([
      getAutoTestRunDetails(serviceId),
      fetchEntity(testSuiteId)
    ])

    return h.view('services/service/automations/views/remove-test-run', {
      pageTitle: `Remove Test Run | Automations - ${serviceId}`,
      serviceId,
      testSuiteId,
      testRun: {
        testSuiteTag: renderTestSuiteTagHtml(testSuite),
        environments: autoTestRunDetails?.testSuites?.[testSuiteId].find(
          (cfg) => (cfg.profile ?? '') === (profile ?? '')
        )?.environments,
        profile
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
