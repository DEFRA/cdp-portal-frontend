import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideAuthedUser } from '../../common/helpers/auth/pre/provide-authed-user.js'
import { buildServicesTableData } from './helpers/build-services-table-data.js'
import { servicesInfoToDataList } from './transformers/services-info-to-data-list.js'

const servicesListController = {
  options: {
    id: 'services',
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
    const userScopeUUIDs = authedUser?.uuidScope ?? []
    const service = request.query.service
    const teamId = request.query.teamId

    const { rows, servicesCount, filters } = await buildServicesTableData({
      service,
      teamId,
      userScopeUUIDs
    })

    return h.view('services/list/views/list', {
      pageTitle: 'Services',
      tableData: {
        headers: [
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          { id: 'service', text: 'Service', width: '20', isLeftAligned: true },
          { id: 'team', text: 'Team', width: '20' },
          { id: 'type', text: 'Type', width: '20' },
          { id: 'github-url', text: 'GitHub Repository', width: '25' },
          { id: 'created', text: 'Created', width: '15' }
        ],
        rows,
        noResult: 'No services found',
        isWide: true
      },
      serviceFilters: filters.service,
      teamFilters: filters.team,
      servicesInfo: servicesInfoToDataList(servicesCount)
    })
  }
}

export { servicesListController }
