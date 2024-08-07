import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch'
import { transformTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchCdpTeams()
    const entityRows = teams?.map(transformTeamToEntityRow)

    return h.view('admin/teams/views/teams-list', {
      pageTitle: 'Teams',
      heading: 'Teams',
      entityRows,
      noResult: 'Currently there are no teams'
    })
  }
}

export { teamsListController }
