import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { provideAuthedUser } from '../../../../common/helpers/auth/pre/provide-authed-user.js'
import { buildAutoTestRunsViewDetails } from '../helpers/build-auto-test-runs-view-details.js'
import { excludedEnvironments } from '../helpers/constants/excluded-environments.js'

const autoTestRunsController = {
  options: {
    id: 'services/{serviceId}/automations/test-runs',
    pre: [provideAuthedUser],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const serviceId = request.params.serviceId
    const entity = request.app.entity
    const serviceTeams = entity?.teams

    if (entity == null) {
      return Boom.notFound()
    }

    const environments = getEnvironments(authedUser?.scope).filter(
      (env) => !excludedEnvironments.includes(env.toLowerCase())
    )

    const environmentOptions = buildOptions(
      environments.map((env) => ({ text: formatText(env), value: env })),
      false
    )

    const { testSuiteOptions, rows } = await buildAutoTestRunsViewDetails({
      serviceTeams,
      serviceId,
      environments
    })
    const supportVerticalHeadings = environments.length >= 5

    return h.view('services/service/automations/views/auto-test-runs', {
      pageTitle: `Test Runs | Automations - ${serviceId}`,
      entity,
      testSuiteOptions,
      environmentOptions,
      tableData: {
        headers: [
          { id: 'test-suite', text: 'Test suite', width: '20' },
          { id: 'kind', text: 'Kind', width: '8' },
          ...environments.map((env) => ({
            ...(supportVerticalHeadings && { verticalText: true }),
            id: env.toLowerCase(),
            text: formatText(env),
            width: env.length
          })),
          { id: 'actions', text: 'Actions', isRightAligned: true, width: '10' }
        ],
        rows,
        noResult:
          'Currently you have no tests set up to run after service deployment'
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
          text: 'Test Runs'
        }
      ]
    })
  }
}

export { autoTestRunsController }
