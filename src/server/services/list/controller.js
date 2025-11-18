import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildServicesTableData } from './helpers/build-services-table-data.js'
import { servicesInfoToDataList } from './transformers/services-info-to-data-list.js'

const servicesListController = {
  options: {
    id: 'services',
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
    const userSession = request.auth.credentials
    const userScopes = userSession?.scope ?? []
    const service = request.query.service
    const teamId = request.query.teamId

    const { rows, servicesCount, filters } = await buildServicesTableData({
      service,
      teamId,
      userScopes
    })

    return h.view('services/list/views/list', {
      pageTitle: 'Services',
      tableData: {
        headers: [
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          { id: 'service', text: 'Service', width: '23', isLeftAligned: true },
          { id: 'team', text: 'Team', width: '22' },
          { id: 'type', text: 'Type', width: '10' },
          { id: 'github-url', text: 'GitHub Repository', width: '30' },
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
