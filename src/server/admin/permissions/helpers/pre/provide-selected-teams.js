import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'

const provideSelectedTeams = {
  method: async (request) => {
    const teamIds = request.query?.teamIds ?? []

    if (teamIds.length) {
      const fetchTeamsPromises = teamIds.map(async (teamId) => {
        const { team } = await fetchCdpTeam(teamId)
        return { name: team.name, teamId: team.teamId }
      })

      return Promise.all(fetchTeamsPromises)
    }

    return []
  },
  assign: 'selectedTeams'
}

export { provideSelectedTeams }
