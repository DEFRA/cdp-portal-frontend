import { fetchTeams } from '~/src/server/teams/helpers/fetch'
import { teamToEntityRow } from '~/src/server/teams/transformers/team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchTeams()
    const entityRows = teams?.map(teamToEntityRow)

    return h.view('teams/views/list', {
      pageTitle: 'Teams',
      heading: 'Teams',
      entityRows
    })
  }
}

export { teamsListController }
