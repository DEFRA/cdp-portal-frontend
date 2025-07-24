import Joi from 'joi'
import Boom from '@hapi/boom'

import {
  fetchTestRepository,
  getAutoTestRunDetails
} from '../../helpers/fetchers.js'
import { getEnvironments } from '../../../../../common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '../../helpers/constants/excluded-environments.js'
import { buildOptions } from '../../../../../common/helpers/options/build-options.js'
import { formatText } from '../../../../../../config/nunjucks/filters/filters.js'
import { provideAuthedUser } from '../../../../../common/helpers/auth/pre/provide-authed-user.js'

const updateTestRunFormController = {
  options: {
    id: 'services/{serviceId}/automations/test-runs/{testSuiteId}/update',
    pre: [provideAuthedUser],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        testSuiteId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId

    const [autoTestRunDetails, repository] = await Promise.all([
      getAutoTestRunDetails(serviceId),
      fetchTestRepository(testSuiteId)
    ])

    const environments = getEnvironments(authedUser?.scope).filter(
      (env) => !excludedEnvironments.includes(env.toLowerCase())
    )
    const environmentOptions = buildOptions(
      environments.map((env) => ({ text: formatText(env), value: env })),
      false
    )

    return h.view('services/service/automations/views/update-test-run', {
      pageTitle: `Update Test Run | Automations - ${serviceId}`,
      serviceId,
      testSuiteId,
      formValues: {
        environments: autoTestRunDetails?.testSuites?.[testSuiteId] ?? []
      },
      testRun: {
        repository,
        environments: autoTestRunDetails?.testSuites?.[testSuiteId]
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
