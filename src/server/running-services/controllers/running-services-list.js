import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildRunningServicesTableData } from '../helpers/build-running-services-table-data.js'

const runningServicesListController = {
  options: {
    id: 'running-services',
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
      rows,
      environments,
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters
    })
  }
}

export { runningServicesListController }
