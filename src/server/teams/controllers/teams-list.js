import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { transformTeamToEntityRow } from '~/src/server/teams/transformers/transform-team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchTeams()
    const entityRows = teams?.map(transformTeamToEntityRow)

    return h.view('teams/views/list', {
      pageTitle: 'Teams',
      heading: 'Teams',
      entityRows
    })
  }
}

export { teamsListController }
