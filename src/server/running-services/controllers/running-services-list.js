import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '../../../config/nunjucks/filters/filters.js'
import { buildRunningServicesTableData } from '../helpers/build-running-services-table-data.js'

import { performance } from 'perf_hooks'

const perf = {}

function start(request, name) {
  request.logger?.info(`-------------- ${name} start`)
  perf[name] = {}
  perf[name].start = performance.now()
}

function end(request, name) {
  perf[name].end = performance.now()
  request.logger?.info(`${name} took ${perf[name].end - perf[name].start}ms`)
  request.logger?.info(`-------------- ${name} end`)
}

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
    start(request, 'one')
    const {
      rows,
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      environments
    } = await buildRunningServicesTableData(request)
    end(request, 'one')

    start(request, 'nine')
    const view = h.view('running-services/views/list', {
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
    end(request, 'nine')

    return view
  }
}

export { runningServicesListController }
