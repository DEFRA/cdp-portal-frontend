import qs from 'qs'
import Boom from '@hapi/boom'

import { fetchCdpTeams } from '#server/admin/teams/helpers/fetch/fetchers.js'

const addTeamsController = {
  handler: async (request, h) => {
    const { button, teamQuery } = request.payload

    const teamIds = [
      ...new Set([].concat(request.payload.teamIds ?? []).filter(Boolean))
    ]

    // Search without saving the selection
    if (button === 'search') {
      const queryString = qs.stringify(
        {
          teamQuery,
          teamIds,
          teamSearchSubmitted: 'true'
        },
        {
          addQueryPrefix: true,
          arrayFormat: 'repeat',
          skipNulls: true
        }
      )

      return h.redirect(`/admin/users/teams${queryString}`)
    }

    // Validate selected IDs against the available teams
    const allTeams = await fetchCdpTeams()

    const availableTeamIds = new Set(allTeams.map((team) => team.teamId))

    const invalidTeamIds = teamIds.filter(
      (teamId) => !availableTeamIds.has(teamId)
    )

    if (invalidTeamIds.length) {
      throw Boom.badRequest('Invalid team selection')
    }

    // Preserve existing users and update team selections
    const stepData = request.app.getStepData()

    await request.app.initStepData({
      ...stepData,
      teamsToAssign: teamIds
    })

    return h.redirect('/admin/users/summary')
  }
}

export { addTeamsController }
