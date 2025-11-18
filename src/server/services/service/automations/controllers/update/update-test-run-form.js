import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../../common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '../../helpers/constants/excluded-environments.js'
import { buildOptions } from '../../../../../common/helpers/options/build-options.js'
import { formatText } from '../../../../../../config/nunjucks/filters/filters.js'
import { provideNotFoundIfPrototype } from '../../../../../common/helpers/ext/provide-not-found-if-prototype.js'
import { provideNotFoundIfNull } from '../../../../../common/helpers/ext/provide-not-found-if-null.js'
import { getAutoTestRunDetails } from '../../helpers/fetchers.js'
import { renderTestSuiteTagHtml } from '../../helpers/render-test-suite-tag-html.js'
import { fetchEntity } from '../../../../../common/helpers/fetch/fetch-entities.js'
import { profileValidation } from '@defra/cdp-validation-kit'

const updateTestRunFormController = {
  options: {
    id: 'services/{serviceId}/automations/test-runs/{testSuiteId}/update',
    ext: {
      onPreAuth: [provideNotFoundIfPrototype, provideNotFoundIfNull]
    },
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        testSuiteId: Joi.string().required()
      }),
      query: Joi.object({
        profile: profileValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId
    const profile = request.query.profile

    const autoTestRunDetails = await getAutoTestRunDetails(serviceId)

    const availableEnvironments = getEnvironments(userSession?.scope).filter(
      (env) => !excludedEnvironments.includes(env.toLowerCase())
    )
    const environmentOptions = buildOptions(
      availableEnvironments.map((env) => ({
        text: formatText(env),
        value: env
      })),
      false
    )

    const testSuite = await fetchEntity(testSuiteId)

    const environments = autoTestRunDetails?.testSuites?.[testSuiteId].find(
      (cfg) => (cfg.profile ?? '') === (profile ?? '')
    )?.environments
    return h.view('services/service/automations/views/update-test-run', {
      pageTitle: `Update Test Run | Automations - ${serviceId}`,
      serviceId,
      testSuiteId,
      formValues: {
        environments
      },
      testRun: {
        testSuiteTag: renderTestSuiteTagHtml(testSuite),
        environments,
        profile
      },
      environmentOptions,
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
          text: 'Update'
        }
      ]
    })
  }
}

export { updateTestRunFormController }
