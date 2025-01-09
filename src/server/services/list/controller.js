import Joi from 'joi'
import Boom from '@hapi/boom'
import { validate as uuidValidate } from 'uuid'

import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { buildTableData } from '~/src/server/services/list/helpers/build-table-data.js'

const serviceListController = {
  options: {
    pre: [provideAuthedUser],
    validate: {
      query: Joi.object({
        service: Joi.string().allow(''),
        teamId: Joi.string().allow(''),
        page: Joi.number(),
        size: Joi.number()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScope = authedUser?.scope.filter(uuidValidate) ?? []
    const service = request.query.service
    const teamId = request.query.teamId

    const { rows, filters } = await buildTableData({
      service,
      teamId,
      isAuthenticated,
      userScope
    })

    return h.view('services/list/views/list', {
      pageTitle: 'Services',
      tableData: {
        headers: [
          ...(isAuthenticated ? [{ text: null, size: '20-fixed' }] : []),
          { text: 'Service', width: '15' },
          { text: 'Team', width: '15' },
          { text: 'Kind', width: '10' },
          { text: 'Language', width: '10' },
          { text: 'GitHub Repository', width: '20' },
          { text: 'Created', width: '30' }
        ],
        rows,
        noResult: 'No services found'
      },
      serviceFilters: filters.service,
      teamFilters: filters.team
    })
  }
}

export { serviceListController }
