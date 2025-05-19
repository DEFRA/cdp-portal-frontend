import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { buildRunningServicesTableData } from '~/src/server/running-services/helpers/build-running-services-table-data.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

const runningServicesListController = {
  options: {
    id: 'running-services',
    pre: [provideAuthedUser],
    validate: {
      query: Joi.object({
        service: Joi.string().allow(''),
        user: Joi.string().allow(''),
        status: Joi.string().allow(''),
        team: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const {
      rows,
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      environments
    } = await buildRunningServicesTableData(request)

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      tableData: {
        headers: [
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          { id: 'service', text: 'Service', width: '15', isLeftAligned: true },
          { id: 'team', text: 'Team', width: '15' },
          ...environments.map((env) => ({
            id: env.toLowerCase(),
            text: formatText(env),
            width: 70 / environments.length
          }))
        ],
        rows,
        noResult: 'No running services found',
        isWide: true
      },
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters
    })
  }
}

export { runningServicesListController }
