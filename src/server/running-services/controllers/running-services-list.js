import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { buildTableData } from '~/src/server/running-services/helpers/build-table-data.js'

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
      environments,
      isAuthenticated
    } = await buildTableData(request)

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      tableData: {
        headers: [
          ...(isAuthenticated ? [{ text: null, size: '20-fixed' }] : []),
          { text: 'Service', width: '15' },
          { text: 'Team', width: '15' },
          ...environments.map((env) => ({
            text: env,
            width: 70 / environments.length
          }))
        ],
        rows,
        noResult: 'No running services found'
      },
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters
    })
  }
}

export { runningServicesListController }
