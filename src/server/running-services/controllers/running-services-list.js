import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildRunningServicesTableData } from '../helpers/build-running-services-table-data.js'
import { getUserTeamsUnexpanded } from '#server/common/helpers/user/get-users-teams.js'

const runningServicesListController = {
  options: {
    id: 'running-services',
    validate: {
      query: Joi.object({
        service: Joi.string().allow(''),
        user: Joi.string().allow(''),
        status: Joi.string().allow(''),
        team: Joi.array().items(Joi.string()).single()
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

    const userTeams = getUserTeamsUnexpanded(request)
    const queryTeams = request.query.team ?? []

    const queryMatchesUserTeams = sameTeams(userTeams, queryTeams)

    let teamValue

    if (queryTeams.length > 1) {
      teamValue = queryMatchesUserTeams ? 'my-teams' : 'selected-teams'

      if (!queryMatchesUserTeams) {
        teamFilters.splice(1, 0, {
          value: 'selected-teams',
          text: 'Selected Teams',
          queryParams: {
            team: queryTeams
          }
        })
      }
    } else {
      teamValue = queryTeams[0]
    }

    if (userTeams.length > 1) {
      teamFilters.splice(1, 0, {
        value: 'my-teams',
        text: 'My Teams',
        queryParams: {
          team: userTeams
        }
      })
    }

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      rows,
      environments,
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      teamValue
    })
  }
}

function sameTeams(a, b) {
  const setA = new Set(a)
  const setB = new Set(b)

  return setA.size === setB.size && [...setA].every((team) => setB.has(team))
}

export { runningServicesListController }
