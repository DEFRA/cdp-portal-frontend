import Joi from 'joi'
import Boom from '@hapi/boom'

import { servicesInfoToDataList } from '../transformers/services-info-to-data-list.js'
import { buildAllServicesTableData } from '../helpers/build-all-services-table-data.js'

const servicesListRoute = {
  options: {
    id: 'services/all',
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
    const userScopes = request.auth.credentials?.scope ?? []
    const service = request.query.service
    const teamId = request.query.teamId

    const { rows, servicesCount, filters } = await buildAllServicesTableData({
      service,
      teamId,
      userScopes
    })
    const path = '/services/all'

    return h.view('services/list/views/list', {
      pageTitle: 'All Services',
      caption: 'All',
      action: path,
      clear: path,
      tableData: {
        headers: [
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          { id: 'service', text: 'Service', width: '23' },
          { id: 'team', text: 'Team', width: '22' },
          { id: 'type', text: 'Type', width: '10' },
          { id: 'github-url', text: 'GitHub Repository', width: '30' },
          { id: 'created', text: 'Created', width: '15' }
        ],
        rows,
        noResult: 'No services found',
        isInverse: true,
        isWide: true
      },
      serviceFilters: filters.service,
      teamFilters: filters.team,
      servicesInfo: servicesInfoToDataList(servicesCount)
    })
  }
}

export { servicesListRoute }
