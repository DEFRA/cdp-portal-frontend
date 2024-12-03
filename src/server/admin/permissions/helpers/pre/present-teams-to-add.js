import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'

const presentTeamsToAdd = {
  method: async (request) => {
    const teamIds = request.query?.teamIds ?? []

    if (teamIds.length) {
      const fetchTeamPromises = teamIds.map(async (teamId) => {
        const { team } = await fetchCdpTeam(teamId)
        return { name: team.name, teamId: team.teamId }
      })

      return Promise.all(fetchTeamPromises)
    }

    return []
  },
  assign: 'teamsToAdd'
}

export { presentTeamsToAdd }
