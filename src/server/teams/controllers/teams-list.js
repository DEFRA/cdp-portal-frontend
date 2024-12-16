import { fetchTeams } from '~/src/server/teams/helpers/fetch/fetch-teams.js'
import { teamToEntityRow } from '~/src/server/teams/transformers/team-to-entity-row.js'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchTeams()
    const entityRows = teams?.map(teamToEntityRow)

    return h.view('teams/views/list', {
      pageTitle: 'Teams',
      entityRows
    })
  }
}

export { teamsListController }
