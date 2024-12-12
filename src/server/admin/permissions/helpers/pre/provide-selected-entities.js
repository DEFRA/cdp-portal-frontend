import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'
import { extractIds } from '~/src/server/admin/permissions/helpers/extract-ids.js'

const provideSelectedEntities = {
  method: async (request) => {
    const entityIds = request.query?.entityIds ?? []

    if (entityIds.length) {
      const userIds = extractIds(entityIds, 'user')
      const fetchUsersPromises = userIds.map(async (userId) => {
        const { user } = await fetchCdpUser(userId)
        return { name: user.name, id: user.userId, kind: 'user' }
      })

      const teamIds = extractIds(entityIds, 'team')
      const fetchTeamsPromises = teamIds.map(async (teamId) => {
        const { team } = await fetchCdpTeam(teamId)
        return { name: team.name, id: team.teamId, kind: 'team' }
      })

      return Promise.all([...fetchUsersPromises, ...fetchTeamsPromises])
    }

    return []
  },
  assign: 'selectedEntities'
}

export { provideSelectedEntities }
