import { fetchCdpTeam } from '../../../teams/helpers/fetch/fetchers.js'
import { fetchCdpUser } from '../../../users/helpers/fetch/fetchers.js'
import { extractIds } from '../extract-ids.js'

const provideSelectedEntities = {
  method: async (request) => {
    const entityIds = request.query?.entityIds ?? []

    if (entityIds.length) {
      const userIds = extractIds(entityIds, 'user')
      const fetchUsersPromises = userIds.map(async (userId) => {
        const user = await fetchCdpUser(userId)
        return { name: user.name, id: user.userId, kind: 'user' }
      })

      const teamIds = extractIds(entityIds, 'team')
      const fetchTeamsPromises = teamIds.map(async (teamId) => {
        const team = await fetchCdpTeam(teamId)
        return { name: team.name, id: team.teamId, kind: 'team' }
      })

      return Promise.all([...fetchUsersPromises, ...fetchTeamsPromises])
    }

    return []
  },
  assign: 'selectedEntities'
}

export { provideSelectedEntities }
