import Joi from 'joi'
import Boom from '@hapi/boom'
import { validate as uuidValidate } from 'uuid'

import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { buildServicesTableData } from '~/src/server/services/list/helpers/build-services-table-data.js'
import { servicesInfoToDataList } from '~/src/server/services/list/transformers/services-info-to-data-list.js'

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
    const userScopeUUIDs = authedUser?.scope.filter(uuidValidate) ?? []
    const service = request.query.service
    const teamId = request.query.teamId

    const { rows, servicesCount, filters } = await buildServicesTableData({
      service,
      teamId,
      isAuthenticated,
      userScopeUUIDs
    })

    return h.view('services/list/views/list', {
      pageTitle: 'Services',
      tableData: {
        headers: [
          ...(isAuthenticated
            ? [{ id: 'owner', text: null, size: '20-fixed' }]
            : []),
          { id: 'service', text: 'Service', width: '15' },
          { id: 'team', text: 'Team', width: '15' },
          { id: 'kind', text: 'Kind', width: '10' },
          { id: 'language', text: 'Language', width: '10' },
          { id: 'github-repository', text: 'GitHub Repository', width: '20' },
          { id: 'created', text: 'Created', width: '30' }
        ],
        rows,
        noResult: 'No services found'
      },
      serviceFilters: filters.service,
      teamFilters: filters.team,
      servicesInfo: servicesInfoToDataList(servicesCount)
    })
  }
}

export { serviceListController }
